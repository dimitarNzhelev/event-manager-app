export function GrafanaDashboard({ dashboardUrl }: { dashboardUrl: string }) {
  return (
    <iframe
      src={dashboardUrl}
      width="100%"
      height="600"
      frameBorder="0"
    ></iframe>
  )
}

