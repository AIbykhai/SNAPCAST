import React from "react"

interface AnalystLayoutProps {
  children: React.ReactNode
}

export function AnalystLayout({ children }: AnalystLayoutProps) {
  // First child is the URL input panel, second child is the results list
  const [inputPanel, resultsList] = React.Children.toArray(children)

  return (
    <div className="grid gap-6 lg:grid-cols-[350px,1fr] lg:gap-8">
      <div>{inputPanel}</div>
      <div>{resultsList}</div>
    </div>
  )
}
