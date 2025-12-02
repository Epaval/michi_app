 'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [productoEditando, setProductoEditando] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Estado para el modal de notificación (toast)
  const [mensaje, setMensaje] = useState(null); // { texto, tipo: 'éxito' | 'error' }

  // Cargar productos al iniciar
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch('/api/productos');
        if (res.ok) {
          const data = await res.json();
          setProductos(data);
        } else {
          mostrarMensaje('❌ Error al cargar productos', 'error');
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarMensaje('⚠️ Error de conexión', 'error');
      }
    };
    fetchProductos();
  }, []);

  // Mostrar mensaje temporal (toast)
  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje(null), 3000); // Desaparece en 3 segundos
  };

  useEffect(() => {
    if (productoEditando) {
      setNombre(productoEditando.nombre);
      setPrecio(productoEditando.precio.toString());
      setStock(productoEditando.stock.toString());
      setDescripcion(productoEditando.descripcion || '');
    } else {
      limpiarFormulario();
    }
  }, [productoEditando]);

  const limpiarFormulario = () => {
    setNombre('');
    setPrecio('');
    setStock('');
    setDescripcion('');
    setProductoEditando(null);
  };

  // Editar o Registrar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock),
      descripcion: descripcion || null,
    };

    try {
      const method = productoEditando ? 'PUT' : 'POST';
      const url = productoEditando ? `/api/productos/${productoEditando.id}` : '/api/productos';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const producto = await res.json();

        if (productoEditando) {
          setProductos(productos.map(p => p.id === producto.id ? producto : p));
          mostrarMensaje('Producto actualizado con éxito', 'éxito');
        } else {
          setProductos([...productos, producto]);
          mostrarMensaje('Producto registrado con éxito', 'éxito');
        }
        limpiarFormulario();
      } else {
        const errorData = await res.json();
        mostrarMensaje(`❌ ${errorData.error || 'Error al guardar'}`, 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('⚠️ Error de conexión', 'error');
    }
  };

  // Confirmar eliminación
  const confirmarEliminacion = async () => {
    if (!productoAEliminar) return;

    try {
      const res = await fetch(`/api/productos/${productoAEliminar.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProductos(productos.filter(p => p.id !== productoAEliminar.id));
        mostrarMensaje(`"${productoAEliminar.nombre}" eliminado`, 'éxito');
      } else {
        mostrarMensaje('No se pudo eliminar', 'error');
      }
    } catch (error) {
      mostrarMensaje('⚠️ Error de conexión', 'error');
    } finally {
      setProductoAEliminar(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-green-900 to-slate-900 text-white p-4 md:p-8">
      <Navbar />

      {/* Modal de Notificación (Toast) */}
      {mensaje && (
        <div
          className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-lg shadow-xl font-medium transform transition-all duration-300 flex items-center gap-2 animate-fade-in ${
            mensaje.tipo === 'éxito' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {mensaje.tipo === 'éxito' ? '✅' : '❌'}
          {mensaje.texto}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">📦 Gestión de Productos</h1>
        <p className="text-gray-300 mb-8">Administra tu inventario de productos</p>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl mb-8 border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-5">➕ {productoEditando ? 'Editar' : 'Agregar'} Producto</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Galletas de chocolate"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Precio ($)</label>
              <input
                type="number"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1.50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Descripción (opcional)</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paquete de 200g"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition transform hover:scale-105"
          >
            {productoEditando ? '💾 Guardar Cambios' : '➕ Registrar Producto'}
          </button>

          {productoEditando && (
            <button
              type="button"
              onClick={limpiarFormulario}
              className="ml-3 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
            >
              Cancelar
            </button>
          )}
        </form>

        {/* Lista de productos */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-white/20">
          <h2 className="text-xl font-semibold p-6 bg-white/10 border-b border-white/20">📋 Inventario</h2>

          {productos.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No hay productos registrados aún.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-200">Nombre</th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-200">Precio</th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-200">Stock</th>
                    <th className="py-3 px-6 text-center text-sm font-medium text-gray-200">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {productos.map((producto) => (
                    <tr key={producto.id} className="hover:bg-white/5 transition duration-150">
                      <td className="py-4 px-6 text-gray-100">{producto.nombre}</td>
                      <td className="py-4 px-6 text-gray-200">Bs. {parseFloat(producto.precio).toFixed(2)}</td>
                      <td className="py-4 px-6 text-gray-200">{producto.stock}</td>
                      <td className="py-4 px-6 text-center space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row items-center justify-center gap-2">
                        <button
                          onClick={() => setProductoEditando(producto)}
                          className="w-full md:w-auto bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center justify-center gap-1"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => setProductoAEliminar(producto)}
                          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center justify-center gap-1"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de confirmación de eliminación */}
        {productoAEliminar && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={() => setProductoAEliminar(null)}
          >
            <div
              className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">¿Eliminar producto?</h3>
                <p className="text-gray-300 mb-4">
                  ¿Estás seguro de eliminar{' '}
                  <span className="font-semibold text-red-400">"{productoAEliminar.nombre}"</span>?
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setProductoAEliminar(null)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition text-sm font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={confirmarEliminacion}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium flex-1"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animación opcional para el toast */}
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