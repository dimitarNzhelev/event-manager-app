import { NextRequest, NextResponse } from 'next/server';
import { env } from '~/env';
import { Alert } from '~/types';

export async function GET(req: NextRequest) {
    const response = await fetch(`${env.BACKEND_URL}/alerts/rules`, {
      headers: {
        Authorization: `Bearer ${env.AUTH_TOKEN}`,
      },
    })
    const result = await response.json()
    return NextResponse.json(result)
  }