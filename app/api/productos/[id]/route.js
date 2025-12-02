 // app/api/productos/[id]/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request, { params }) {  
  const { id } = await params;

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'ID no proporcionado' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return new Response(
      JSON.stringify({ error: 'ID debe ser un número válido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Cuerpo de la solicitud inválido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!body.nombre || body.precio == null || body.stock == null) {
    return new Response(
      JSON.stringify({ error: 'Faltan campos requeridos: nombre, precio, stock' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const producto = await prisma.producto.update({
      where: { id: numericId },
       data:{
        nombre: body.nombre,
        precio: parseFloat(body.precio),
        stock: parseInt(body.stock),
        descripcion: body.descripcion || null,
      },
    });

    return new Response(JSON.stringify(producto), {
      status: 200,
      headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al actualizar producto:', error);

    if (error.code === 'P2025') {
      return new Response(
        JSON.stringify({ error: 'Producto no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// 🗑️ DELETE también necesita `await params`
export async function DELETE(request, { params }) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return new Response(
      JSON.stringify({ error: 'ID inválido' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    await prisma.producto.delete({ where: { id: numericId } });
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'No se pudo eliminar' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}