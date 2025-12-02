// app/api/productos/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { nombre: 'asc' },
    });
    return new Response(JSON.stringify(productos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'No se pudieron cargar los productos' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  const body = await request.json();

  try {
    const producto = await prisma.producto.create({
      data: {
        nombre: body.nombre,
        precio: body.precio,
        stock: body.stock,
        descripcion: body.descripcion || null,
      },
    });
    return new Response(JSON.stringify(producto), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return new Response(
      JSON.stringify({ error: 'No se pudo crear el producto' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

 