// app/api/clientes/route.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  const body = await request.json();
  
  try {
    const cliente = await prisma.cliente.create({
      data: {
        nombre: body.nombre,        
        telefono: body.telefono,
      },
    });
    return new Response(JSON.stringify(cliente), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return new Response(
      JSON.stringify({ error: 'No se pudo registrar el cliente' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Opcional: GET para listar clientes
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return new Response(JSON.stringify(clientes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'No se pudieron cargar los clientes' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}