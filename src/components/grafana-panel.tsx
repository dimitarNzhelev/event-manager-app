import { env } from "~/env"

export function GrafanaPanel() {
    return (
      <div className="bg-gray-800 rounded-lg shadow-xl p-6">
        <iframe
          src={`${env.NEXT_PUBLIC_GRAFANA_URL}/d/fe4lbp0qww6bke?orgId=1&kiosk&refresh=5s`}
          width="100%"
          height="400"
          frameBorder="0"
        ></iframe>
      </div>
    )
  }
  
  