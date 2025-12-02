 'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function VentasPage() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [venta, setVenta] = useState({
    clienteId: '',
    items: [],
    total: 0,
  });
  const [busqueda, setBusqueda] = useState('');
  const [mensaje, setMensaje] = useState(null);  

  // Cargar clientes y productos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, productosRes] = await Promise.all([
          fetch('/api/clientes'),
          fetch('/api/productos'),
        ]);

        if (clientesRes.ok) {
          const clientesData = await clientesRes.json();
          setClientes(clientesData);
        }
        if (productosRes.ok) {
          const productosData = await productosRes.json();
          setProductos(productosData);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        mostrarMensaje('⚠️ Error de conexión', 'error');
      }
    };
    fetchData();
  }, []);

  // Mostrar mensaje temporal (toast)
  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000);
  };

  // Agregar producto al carrito
  const agregarProducto = (productoId) => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto || producto.stock <= 0) return;

    const existente = venta.items.find((item) => item.productoId === productoId);

    if (existente) {
      if (existente.cantidad >= producto.stock) {
        mostrarMensaje(`Stock insuficiente. Máx: ${producto.stock}`, 'advertencia');
        return;
      }
      setVenta((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.productoId === productoId
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ),
        total: prev.total + producto.precio,
      }));
    } else {
      setVenta((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            productoId,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1,
          },
        ],
        total: prev.total + producto.precio,
      }));
      mostrarMensaje(`✅ ${producto.nombre} añadido`, 'éxito');
    }
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.stock > 0 && p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Cambiar cantidad de un producto
  const cambiarCantidad = (productoId, nuevaCantidad) => {
    const producto = productos.find((p) => p.id === productoId);
    const cantidad = Math.max(1, Math.min(nuevaCantidad, producto.stock));

    const item = venta.items.find((i) => i.productoId === productoId);
    const diff = cantidad - item.cantidad;

    setVenta((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.productoId === productoId ? { ...item, cantidad } : item
      ),
      total: prev.total + diff * producto.precio,
    }));
  };

  // Eliminar producto del carrito
  const eliminarItem = (productoId) => {
    const item = venta.items.find((i) => i.productoId === productoId);
    setVenta((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productoId !== productoId),
      total: prev.total - item.precio * item.cantidad,
    }));
    mostrarMensaje(`🗑️ ${item.nombre} eliminado`, 'advertencia');
  };

  // Registrar venta
  const handleSubmit = async () => {
    if (!venta.clienteId || venta.items.length === 0) {
      mostrarMensaje('Selecciona un cliente y al menos un producto', 'advertencia');
      return;
    }

    try {
      const res = await fetch('/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venta),
      });

      if (res.ok) {
        mostrarMensaje('✅ Venta registrada con éxito', 'éxito');
        setVenta({ clienteId: '', items: [], total: 0 });
      } else {
        const data = await res.json();
        mostrarMensaje(`❌ Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('⚠️ Error de conexión', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <Navbar />

      {/* Toast (Notificación flotante) */}
      {mensaje && (
        <div
          className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-lg shadow-xl font-medium flex items-center gap-2 animate-fade-in transition-all duration-300 ${
            mensaje.tipo === 'éxito'
              ? 'bg-emerald-600'
              : mensaje.tipo === 'error'
                ? 'bg-red-600'
                : 'bg-yellow-600'
          }`}
        >
          {mensaje.tipo === 'éxito' && '✅'}
          {mensaje.tipo === 'error' && '❌'}
          {mensaje.tipo === 'advertencia' && '⚠️'}
          {mensaje.texto}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">💰 Registrar Venta</h1>
        <p className="text-gray-300 mb-8">Selecciona un cliente y añade productos al carrito.</p>

        {/* Selección de cliente */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl mb-6 border border-white/20">
          <label className="block text-sm font-medium mb-2">Cliente</label>
          <select
            value={venta.clienteId}
            onChange={(e) => setVenta({ ...venta, clienteId: e.target.value })}
            className="w-full bg-gray-500 border border-white/30 rounded-lg px-4 py-2 text-shadow-white"
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} ({c.telefono || 'Sin teléfono'})
              </option>
            ))}
          </select>
        </div>

        {/* Selector simple con búsqueda */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl mb-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">➕ Agregar Producto</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Buscar producto</label>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Escribe para buscar..."
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-1">
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-2 hover:bg-white/10 rounded cursor-pointer group"
                    onClick={() => {
                      const existente = venta.items.find((i) => i.productoId === p.id);
                      if (existente && existente.cantidad >= p.stock) {
                        mostrarMensaje(`Stock máximo alcanzado: ${p.stock}`, 'advertencia');
                        return;
                      }
                      agregarProducto(p.id);
                    }}
                  >
                    <span>{p.nombre}</span>
                    <span className="text-sm text-gray-300 group-hover:text-white">
                      Bs. {p.precio.toFixed(2)} | Stock: {p.stock}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No se encontraron productos.</p>
              )}
            </div>
          </div>
        </div>

        {/* Carrito de compras */}
        {venta.items.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl mb-6 border border-white/20">
            <h2 className="text-xl font-semibold mb-4">🛒 Carrito de Compras</h2>
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-2 text-left">Producto</th>
                  <th className="py-2 text-left">Precio</th>
                  <th className="py-2 text-left">Cantidad</th>
                  <th className="py-2 text-left">Total</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {venta.items.map((item) => {
                  const subtotal = item.precio * item.cantidad;
                  return (
                    <tr key={item.productoId} className="border-b border-white/10">
                      <td className="py-2">{item.nombre}</td>
                      <td className="py-2">Bs. {item.precio.toFixed(2)}</td>
                      <td className="py-2">
                        <input
                          type="number"
                          min="1"
                          max={productos.find((p) => p.id === item.productoId)?.stock || 1}
                          value={item.cantidad}
                          onChange={(e) => cambiarCantidad(item.productoId, parseInt(e.target.value))}
                          className="w-16 bg-white/20 border border-white/30 rounded px-2 py-1 text-center text-white"
                        />
                      </td>
                      <td className="py-2">Bs. {subtotal.toFixed(2)}</td>
                      <td className="py-2">
                        <button
                          onClick={() => eliminarItem(item.productoId)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="flex justify-end mt-4 text-lg font-bold">
              Total: Bs. {venta.total.toFixed(2)}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition transform hover:scale-105"
              >
                💵 Registrar Venta
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Animación para el toast */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}