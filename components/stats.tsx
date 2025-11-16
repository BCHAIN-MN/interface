export function Stats() {
  const stats = [
    { label: 'Total Reviews', value: '1,234' },
    { label: 'Verified Students', value: '456' },
    { label: 'Modules Rated', value: '89' },
    { label: 'Avg. Response Time', value: '< 1min' },
  ]

  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
