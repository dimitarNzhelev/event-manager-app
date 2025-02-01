'use server'

import { env } from '~/env'
import type { Alert, AlertPrometheus, AlertRule, CreateAlertRuleParams, ErrResponse, Pod, Silence } from '~/types'

export async function getAlertRules(namespace: string) {
  const response = await fetch(`${env.BACKEND_URL}/rules?namespace=${namespace}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${env.AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const res = await response.json() as ErrResponse
    throw new Error(`Error fetching alert rules: ${res.msg}`)
  }

  const body = await response.json()

  const rules = body.map((rule: any) => ({
    id: rule.metadata.name,
    resourceVersion: rule.metadata.resourceVersion,
    ...rule.spec.groups[0].rules[0],
  }))

  return rules as AlertRule[]
}

export async function getAlerts() {
    const response = await fetch(`${env.BACKEND_URL}/alerts/firing`, {
        headers: {
          Authorization: `Bearer ${env.AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        const res = await response.json() as ErrResponse
        throw new Error(`Error fetching alerts: ${res.msg}`)
      }
      
      const alerts = await response.json();

      processAlert(alerts);

    return alerts as AlertPrometheus[];
}

export async function getAllAlerts() {
  const response = await fetch(`${env.BACKEND_URL}/alerts`, {
    headers: {
      Authorization: `Bearer ${env.AUTH_TOKEN}`,
    },
  });

  if (!response.ok) {
    const res = await response.json() as ErrResponse
    throw new Error(`Error fetching all alerts: ${res.msg}`)
  }

  const alerts = await response.json();

  processAlert(alerts);

return alerts as Alert[];
}

export async function getSilencedAlerts() {
  const response = await fetch(`${env.BACKEND_URL}/alerts/silences`, {
    headers: {
      Authorization: `Bearer ${env.AUTH_TOKEN}`,
    },
  });

  if (!response.ok) {
    const res = await response.json() as ErrResponse
    throw new Error(`Error fetching silenced alerts: ${res.msg}`)
  }

  const alerts = await response.json();

  processAlert(alerts);

return alerts as AlertPrometheus[];
}

export async function getSilences() {
  const response = await fetch(`${env.BACKEND_URL}/silences`, {
    headers: {
      Authorization: `Bearer ${env.AUTH_TOKEN}`,
    },
  });

  if (!response.ok) {
    const res = await response.json() as ErrResponse
    throw new Error(`Error fetching silences: ${res.msg}`)
  }

  const silences = await response.json();

  return silences as Silence[];
}

export async function deleteSilence(id: string) {
  const response = await fetch(`${env.BACKEND_URL}/alerts/silences/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${env.AUTH_TOKEN}`,
    },
  })

  if (!response.ok) {
    const res = await response.json() as ErrResponse
    throw new Error(`Error deleting silence: ${res.msg}`)
  }
}

export async function createSilence(silence: Silence) {
  console.log("Creating silence", silence)
  const response = await fetch(`${env.BACKEND_URL}/alerts/silences`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(silence),
  })
  if (!response.ok) {
    const res = await response.json() as ErrResponse
    throw new Error(`Error creating silence: ${res.msg}`)
  }
}

export async function getPods() {
  const response = await fetch(`${env.BACKEND_URL}/pods`, {
      headers: {
        Authorization: `Bearer ${env.AUTH_TOKEN}`,
      },
    })

    if (!response.ok) {
      const res = await response.json() as ErrResponse
      throw new Error(`Error fetching pods: ${res.msg}`)
    }

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

  if (!response.ok) {
    const res = await response.json() as ErrResponse
    throw new Error(`Error fetching namespaces: ${res.msg}`)
  }
  
  const data = await response.json()
  const namespaces = data.map((namespace: any) => namespace?.metadata?.name ?? "")    
  return namespaces as string[]
}

export async function deleteRule(name: string, namespace: string) {
    const response = await fetch(`${env.BACKEND_URL}/rules/${name}?namespace=${namespace}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${env.AUTH_TOKEN}`,
        }
    });

    if (!response.ok) {
      const res = await response.json() as ErrResponse
      throw new Error(`Error deleting alert rule: ${res.msg}`)
    }
}

export async function updateRule(params: { id: string, namespace: string, updatedRule: AlertRule }) {
  const { id, namespace, updatedRule } = params
  const payload = {
    apiVersion: "monitoring.coreos.com/v1",
    kind: "PrometheusRule",
    metadata: {
      name: id,
      resourceVersion: updatedRule.resourceVersion, 
      namespace: namespace,
      labels: {
        prometheus: "example",
        role: "alert-rules"
      }
    },
    spec: {
      groups: [
        {
          name: "event-manager-app.rules",
          rules: [
            {
              alert: updatedRule.alert,
              expr: updatedRule.expr,
              for: updatedRule.for,
              labels: updatedRule.labels,
              annotations: updatedRule.annotations
            }
          ]
        }
      ]
    }
  }

  const response = await fetch(`${env.BACKEND_URL}/rules/${id}?namespace=${namespace}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${env.AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const res = await response.json() as ErrResponse
    throw new Error(`Error updating alert rule: ${res.msg}`)
  }
}

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
          name: "event-manager-app.rules",
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
    const res = await response.json() as ErrResponse
        throw new Error(`Error creating alert rule: ${res.msg}`)
  }

  return response.ok as boolean
}


function processAlert(alerts: any) {
  if (!alerts) {
    return;
  }
  
  alerts.forEach((alert: any) => {
    if (typeof alert.annotations === 'string') {
      try {
        const sanitizedAnnotations = alert.annotations
          .replace(/\n/g, ' ') 
          .replace(/\\n/g, ' ')

          alert.annotations = JSON.parse(sanitizedAnnotations);
      } catch (e) {
        const error = e as Error;
        throw new Error(`Failed to parse annotations: ${error.message}`);
      }
    }
  });
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

export async function getGrafanaDashboardURL() {
  return env.DASHBOARD_URL;
}


export async function processAlertForSilence(alert: AlertPrometheus, startsAt: string, endsAt: string) {
  const silence = {
    matchers: [] as { name: string; value: string; isRegex: boolean; isEqual: boolean; }[],
    startsAt: startsAt,
    endsAt: endsAt,
    createdBy: "event-manager-app",
    comment: `Silenced by the admin from event-manager-app for alert ${alert.labels.alertname}`,
  } as Silence

  for (const [key, value] of Object.entries(alert.labels)) {
    silence.matchers.push({
      name: key,
      value: value,
      isRegex: false,
      isEqual: true,
    })
  }
  
  await createSilence(silence)
}

export async function unSilenceAlert(alert: AlertPrometheus & { labels: Record<string, string> }) {
  const silences = await getSilences()

  const silence = silences.find((silence: Silence) => {
    return silence?.matchers?.every((matcher) => {
      return alert.labels[matcher.name] === matcher.value
    })
  })

  console.log("Silence to delete", silence?.id)
  if (silence) {
    await deleteSilence(silence.id)
  }
}