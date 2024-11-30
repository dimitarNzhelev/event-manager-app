import { useEffect, useState } from 'react'

export function GrafanaPanel() {
  const [grafanaUrl, setGrafanaUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchGrafanaUrl = async () => {
      try {
        const response = await fetch('/api/grafana-url')
        const data = await response.json()
        setGrafanaUrl(data.grafanaUrl)
      } catch (error) {
        console.error('Error fetching Grafana URL:', error)
      }
    }

    fetchGrafanaUrl()
  }, [])

  if (!grafanaUrl) {
    return <div className="bg-gray-800 rounded-lg shadow-xl p-6">Loading...</div>
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6">
      <iframe
        src={`${grafanaUrl}/d/fe4lbp0qww6bke?orgId=1&kiosk&refresh=5s`}
        width="100%"
        height="400"
        frameBorder="0"
      ></iframe>
    </div>
  )
}