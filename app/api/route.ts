import { NextResponse } from "next/server"

// Health check endpoint localhost/api GET
export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Simulamos un delay de red (500ms)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Aquí simularíamos el envío a un servicio real (email, CRM, base de datos, etc.)
    console.log("Cotización recibida:", body)

    // Simulamos una respuesta exitosa
    return NextResponse.json(
      {
        success: true,
        message: "Cotización recibida exitosamente",
        data: {
          id: `COT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...body,
        },
      },
      { status: 200 },
    )

    // Para simular un error ocasional, descomenta esto:
    // if (Math.random() > 0.8) {
    //   throw new Error('Error al procesar la cotización')
    // }
  } catch (error) {
    console.error("Error al procesar cotización:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar tu solicitud. Por favor intenta nuevamente.",
      },
      { status: 500 },
    )
  }
}
