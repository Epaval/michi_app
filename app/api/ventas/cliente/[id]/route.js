// app/api/ventas/cliente/[id]/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = await params; // Next.js 15+ requiere await
  const clienteId = parseInt(id);

  try {
    const ventas = await prisma.venta.findMany({
      where: { clienteId },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
        cliente: true,
      },
      orderBy: { fecha: 'desc' },
    });

    return new Response(JSON.stringify(ventas), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al cargar historial:', error);
    return new Response(
      JSON.stringify({ error: 'No se pudo cargar el historial' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}