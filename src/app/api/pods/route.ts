import { NextRequest, NextResponse } from 'next/server'
import { env } from '~/env'
import { Pod } from '~/types'

function calculateAge(timestamp: string): string {
  const creationDate = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - creationDate.getTime()

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

export async function GET(req: NextRequest) {
  const response = await fetch(`${env.BACKEND_URL}/pods`, {
    headers: {
      Authorization: `Bearer ${env.AUTH_TOKEN}`,
    },
  })
  const result = await response.json()
  let pods: Pod[] = []
  pods = result.map((pod: any) => {
    return {
      name: pod.metadata.name,
      namespace: pod.metadata.namespace,
      status: pod.status.phase,
      nodeName: pod.spec.nodeName,
      restarts: pod.status.containerStatuses[0].restartCount,
      age: calculateAge(pod.metadata.creationTimestamp),
    }
  })

  return NextResponse.json(pods)
}