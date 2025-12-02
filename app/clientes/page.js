"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState('');  

  // Cargar clientes al iniciar
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch("/api/clientes");
        if (res.ok) {
          const data = await res.json();
          setClientes(data);
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    fetchClientes();
  }, []);

    // Mostrar mensaje temporal
  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipo(tipo);
    setTimeout(() => {
      setMensaje('');
    }, 2000);  
};

  // Registrar nuevo cliente
   const handleSubmit = async (e) => {
  e.preventDefault();
  const nuevoCliente = { nombre, telefono };

  try {
    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoCliente),
    });

    if (res.ok) {
      const clienteCreado = await res.json();
      setClientes([...clientes, clienteCreado]);
      setNombre("");
      setTelefono("");
      mostrarMensaje("✅ Cliente registrado con éxito", "éxito");
    } else {
      mostrarMensaje("❌ Error al registrar el cliente", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    mostrarMensaje("⚠️ Error de conexión", "error");
  }
};

  // Eliminar cliente
  const confirmarEliminacion = async () => {
    if (!clienteAEliminar) return;

    try {
      const res = await fetch(`/api/clientes/${clienteAEliminar.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setClientes(clientes.filter((c) => c.id !== clienteAEliminar.id));
        alert(
          `✅ Cliente "${clienteAEliminar.nombre}" eliminado correctamente`
        );
      } else {
        throw new Error(data.error || "No se pudo eliminar");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert(`❌ ${error.message}`);
    } finally {
      setClienteAEliminar(null); // Cierra el modal
    }
  };

  // Ver historial de compras
  const verHistorial = async (cliente) => {
    setClienteSeleccionado(cliente);
    setCargando(true);
    setHistorial([]);

    try {
      const res = await fetch(`/api/ventas/cliente/${cliente.id}`);
      if (res.ok) {
        const data = await res.json();
        setHistorial(data);
      } else {
        alert("❌ No se pudo cargar el historial");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Error de conexión");
    } finally {
      setCargando(false);
    }
  };



  return (
    
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
          👥 Gestión de Clientes
        </h1>
        <p className="text-gray-300 mb-8 text-center md:text-left">
          Administra tus clientes y su historial de compras
        </p>
        {/* Modal de mensaje temporal */}
        {mensaje && (
          <div className={`fixed top-5 right-5 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 ${
            tipo === 'éxito' 
              ? 'bg-green-600' 
              : 'bg-red-600'
          }`}>
            {mensaje}
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl mb-8 border border-white/20"
        >
          <h2 className="text-xl font-semibold mb-5 text-white">
            ➕ Agregar Cliente
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');  
                    if (value.length >= 4) {
                      value = value.slice(0, 4) + '-' + value.slice(4);  
                    }                    
                    setTelefono(value.slice(0, 12));
                  }}
                  maxLength={12}
                  className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0424-1234567"
                  required
                />
              </div>
            
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition transform hover:scale-105"
          >
            Registrar Cliente
          </button>
        </form>

        {/* Lista de clientes */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-white/20">
          <h2 className="text-xl font-semibold p-6 bg-white/10 border-b border-white/20">
            📋 Clientes Registrados
          </h2>

          {clientes.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No hay clientes registrados aún.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-200">
                      Nombre
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-200">
                      Teléfono
                    </th>
                    <th className="py-3 px-6 text-center text-sm font-medium text-gray-200">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {clientes.map((cliente) => (
                    <tr
                      key={cliente.id}
                      className="hover:bg-white/5 transition duration-150"
                    >
                      <td className="py-4 px-6 text-gray-100">
                        {cliente.nombre}
                      </td>
                      <td className="py-4 px-6 text-gray-200">
                        {cliente.telefono || "Sin teléfono"}
                      </td>
                      <td className="py-4 px-6 text-center space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row items-center justify-center gap-2">
                        <button
                          onClick={() => verHistorial(cliente)}
                          className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition flex items-center justify-center gap-1"
                        >
                          📋 Historial
                        </button>
                        <button
                          onClick={() => setClienteAEliminar(cliente)}
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
      </div>
      {/* Modal de Confirmación */}
      {clienteAEliminar && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setClienteAEliminar(null)} // Cerrar al hacer clic fuera
        >
          <div
            className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full border border-white/20"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">
                ¿Eliminar cliente?
              </h3>
              <p className="text-gray-300 mb-4">
                ¿Estás seguro de que deseas eliminar al cliente{" "}
                <span className="font-semibold text-red-400">
                  "{clienteAEliminar.nombre}"
                </span>
                ? Esta acción no se puede deshacer.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setClienteAEliminar(null)}
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

      {/* Modal de Historial de Compras */}
      {clienteSeleccionado && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setClienteSeleccionado(null)}
        >
          <div
            className="bg-slate-800 rounded-xl shadow-2xl max-w-3xl w-full border border-white/20 max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/20">
              <h3 className="text-xl font-bold text-white">
                Historial de {clienteSeleccionado.nombre}
              </h3>
              <p className="text-gray-300 text-sm">Ventas registradas</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cargando ? (
                <div className="text-center text-gray-400">Cargando...</div>
              ) : historial.length === 0 ? (
                <div className="text-center text-gray-400">
                  No hay ventas registradas.
                </div>
              ) : (
                <div className="space-y-6">
                  {historial.map((venta) => (
                    <div
                      key={venta.id}
                      className="bg-white/10 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex justify-between text-sm text-gray-300 mb-2">
                        <span>
                          Fecha: {new Date(venta.fecha).toLocaleDateString()}
                        </span>
                        <span>Total: Bs. {venta.total.toFixed(2)}</span>
                      </div>
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/20">
                            <th className="py-1 text-left">Producto</th>
                            <th className="py-1 text-left">Cant.</th>
                            <th className="py-1 text-left">Precio</th>
                            <th className="py-1 text-left">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {venta.items.map((item) => (
                            <tr key={item.id}>
                              <td className="py-1">{item.producto.nombre}</td>
                              <td className="py-1">{item.cantidad}</td>
                              <td className="py-1">
                                Bs. {item.precio.toFixed(2)}
                              </td>
                              <td className="py-1">
                                Bs. {(item.precio * item.cantidad).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/20 flex justify-end">
              <button
                onClick={() => setClienteSeleccionado(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
