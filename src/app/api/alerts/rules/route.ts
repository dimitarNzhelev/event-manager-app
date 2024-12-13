import { NextRequest, NextResponse } from 'next/server';
import { env } from '~/env';
import { Alert } from '~/types';

export async function GET(req: NextRequest) {
    const response = await fetch(`${env.BACKEND_URL}/rules?namespace=monitoring`, {
      headers: {
        Authorization: `Bearer ${env.AUTH_TOKEN}`,
      },
    })
    const result = await response.json()
    const rules = result.map((rule: any) => rule.spec.groups[0].rules[0])
    return NextResponse.json(rules)
  }