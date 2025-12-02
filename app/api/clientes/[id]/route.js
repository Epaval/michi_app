// app/api/clientes/[id]/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // Verificar si existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
    });

    if (!clienteExistente) {
      return new Response(
        JSON.stringify({ error: 'Cliente no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Eliminar
    await prisma.cliente.delete({
      where: { id: parseInt(id) },
    });

    return new Response(
      JSON.stringify({ success: true, message: 'Cliente eliminado' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al eliminar:', error);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}