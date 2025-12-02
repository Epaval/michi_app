 'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo / Título */}
          <Link href="/" className="text-lg font-bold">
            
          </Link>

          {/* Botón hamburguesa (solo en móvil) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded hover:bg-white/10"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Enlaces (ocultos en móvil por defecto) */}
          <div
            className={`${
              isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
            } md:max-h-full md:opacity-100 md:flex flex-col md:flex-row md:space-y-0 md:space-x-6 overflow-hidden transition-all duration-300 ease-in-out w-full md:w-auto`}
          >
            <Link
              href="/"
              className="block py-2 px-4 hover:text-blue-300 transition"
              onClick={() => setIsOpen(false)}
            >
              🏠 Inicio
            </Link>
            <Link
              href="/clientes"
              className="block py-2 px-4 hover:text-blue-300 transition"
              onClick={() => setIsOpen(false)}
            >
              👥 Clientes
            </Link>
            <Link
              href="/productos"
              className="block py-2 px-4 hover:text-blue-300 transition"
              onClick={() => setIsOpen(false)}
            >
              📦 Productos
            </Link>
            <Link
              href="/ventas"
              className="block py-2 px-4 hover:text-blue-300 transition"
              onClick={() => setIsOpen(false)}
            >
              💰 Ventas
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}