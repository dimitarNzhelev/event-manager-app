export interface Alert {
    id: number
    alert_name: string
    labels: {
        alertname: string
        prometheus: string
        severity: string
    }
    annotations: {
        description: string
        runbook_url: string
        summary: string
    }
    start_time: string
    end_time: string
    generatorURL: string
    fingerprint: string
}

export interface Pod {
    name: string
    namespace: string
    status: string
    nodeName: string
    restarts: number
    age: string
  }