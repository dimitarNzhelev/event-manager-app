import { NextRequest, NextResponse } from 'next/server'
import { env } from '~/env'

export async function GET(req: NextRequest) {
  const response = await fetch(`${env.BACKEND_URL}/namespaces`, {
    headers: {
      Authorization: `Bearer ${env.AUTH_TOKEN}`,
    },
  })
  const namespaces = await response.json()
  return NextResponse.json(namespaces)
}