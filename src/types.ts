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
    id: string
    alert?: string
    expr: string
    labels?: {
      severity: string
      [key: string]: string
    }
    annotations: {
      description: string
      runbook_url: string
      summary: string
      [key: string]: string
    }
    for: string
  }


export interface AlertRulesListProps {
  rules: AlertRule[]
  onSelectRule: (rule: AlertRule) => void
}

export interface CreateAlertRuleParams {
  namespace: string
  alertName: string
  expression: string
  duration: string
  severity: string
  summary: string
  description: string
}