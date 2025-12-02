 // app/page.js
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            🛒 michi_app
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Sistema de Control de Ventas
          </p>
          <p className="text-sm text-gray-400 mt-2">Gestiona clientes, productos y ventas fácilmente</p>
        </div>

        {/* Grid de módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          
          {/* Módulo: Clientes */}
          <Link href="/clientes">
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/20 cursor-pointer text-center h-full flex flex-col items-center justify-center space-y-3">
              <div className="text-5xl transition-transform group-hover:rotate-12">
                👥
              </div>
              <h2 className="text-2xl font-bold text-white">Clientes</h2>
              <p className="text-gray-300 text-sm">Administra tu base de clientes</p>
            </div>
          </Link>

          {/* Módulo: Productos */}
          <Link href="/productos">
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/20 cursor-pointer text-center h-full flex flex-col items-center justify-center space-y-3">
              <div className="text-5xl transition-transform group-hover:rotate-12">
                📦
              </div>
              <h2 className="text-2xl font-bold text-white">Productos</h2>
              <p className="text-gray-300 text-sm">Controla tu inventario y precios</p>
            </div>
          </Link>

          {/* Módulo: Ventas */}
          <Link href="/ventas">
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/20 cursor-pointer text-center h-full flex flex-col items-center justify-center space-y-3">
              <div className="text-5xl transition-transform group-hover:spin">
                💰
              </div>
              <h2 className="text-2xl font-bold text-white">Ventas</h2>
              <p className="text-gray-300 text-sm">Registra y gestiona tus ventas</p>
            </div>
          </Link>

        </div>

        {/* Pie de página opcional */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          <p>© 2025 michi_app. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}