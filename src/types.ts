export interface Alert {
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
    } | string
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

export interface AlertRule {
    state: string
    name: string
    query: string
    duration: number
    labels: {
      severity: string
      [key: string]: string
    }
    annotations?: {
      description: string
      summary: string
      [key: string]: string
    }
    health: string
    evaluationTime: number
    lastEvaluation: string
    type: string
  }

export interface AlertRuleGroup {
    name: string
    file: string
    rules: AlertRule[]
}
  
  