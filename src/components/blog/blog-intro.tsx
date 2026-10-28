export function BlogIntro({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return <header className="page-intro"><div className="site-container"><p className="location-label"><span aria-hidden="true" />{label}</p><h1>{title}</h1>{children}</div></header>;
}
