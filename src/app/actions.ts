'use server'

import { env } from '~/env'
import { CreateAlertRuleParams, Pod } from '~/types'

export async function createAlertRule(params: CreateAlertRuleParams) {
  const { alertName, namespace, expression, duration, severity, summary, description } = params

  const payload = {
    apiVersion: "monitoring.coreos.com/v1",
    kind: "PrometheusRule",
    metadata: {
      name: alertName.toLowerCase().replace(/\s+/g, '-'),
      namespace: namespace,
      labels: {
        prometheus: "example",
        role: "alert-rules"
      }
    },
    spec: {
      groups: [
        {
          name: "example.rules",
          rules: [
            {
              alert: alertName,
              expr: expression,
              for: duration,
              labels: {
                severity: severity
              },
              annotations: {
                summary: summary,
                description: description
              }
            }
          ]
        }
      ]
    }
  }

  const response = await fetch(`${env.BACKEND_URL}/rules`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    console.error("Error response", response)
    throw new Error('Failed to create alert rule')
  }

  return response.ok
}

export async function getAlertRules(namespace: string) {
  const response = await fetch(`${env.BACKEND_URL}/rules?namespace=${namespace}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${env.AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch alert rules')
  }

  const body = await response.json()

  const rules = body.map((rule: any) => rule.spec.groups[0].rules[0])

  return rules
}

export async function getAlerts() {
    const response = await fetch(`${env.BACKEND_URL}/alerts`, {
        headers: {
          Authorization: `Bearer ${env.AUTH_TOKEN}`,
        },
      });
      const alerts = await response.json();
      console.log("ALERTS", )
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

    return alerts;
}

export async function getPods() {
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

    return pods;
}

export async function getNamespaces() {
    const response = await fetch(`${env.BACKEND_URL}/namespaces`, {
        headers: {
          Authorization: `Bearer ${env.AUTH_TOKEN}`,
        },
      })
    const data = await response.json()
    const namespaces = data.map((namespace: any) => namespace?.metadata?.name ?? "")    
    return namespaces
}


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