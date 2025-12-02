// app/api/ventas/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { clienteId, items } = await request.json();

    if (!clienteId || !items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Datos incompletos' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar stock antes de crear la venta
    for (const item of items) {
      const producto = await prisma.producto.findUnique({
        where: { id: item.productoId },
      });

      if (!producto || producto.stock < item.cantidad) {
        return new Response(
          JSON.stringify({ 
            error: `Stock insuficiente para: ${producto?.nombre}` 
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Crear la venta
    const venta = await prisma.venta.create({
      data: {
        clienteId: parseInt(clienteId),
        total: items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0),
        items: {
          create: items.map(item => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precio: item.precio,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Actualizar el stock de cada producto
        for (const item of items) {
        await prisma.producto.update({
           where: { id: item.productoId },
           data:{ stock: { decrement: item.cantidad } },
        });
        }

    return new Response(JSON.stringify(venta), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al registrar venta:', error);
    return new Response(
      JSON.stringify({ error: 'No se pudo registrar la venta' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}