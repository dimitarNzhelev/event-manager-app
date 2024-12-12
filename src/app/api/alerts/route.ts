import { NextRequest, NextResponse } from 'next/server';
import { env } from '~/env';

export async function GET(req: NextRequest) {
  const response = await fetch(`${env.BACKEND_URL}/alerts`, {
    headers: {
      Authorization: `Bearer ${env.AUTH_TOKEN}`,
    },
  });
  const alerts = await response.json();

  alerts.forEach((alert: any) => {
    if (typeof alert.annotations === 'string') {
      try {
        const sanitizedAnnotations = alert.annotations
          .replace(/\n/g, ' ') 
          .replace(/\\n/g, ' ')

          alert.annotations = JSON.parse(sanitizedAnnotations);
      } catch (e) {
        console.error('Failed to parse annotations:', e);
      }
    }
  });

  return NextResponse.json(alerts);
}
