export function AdminLogo() {
  return (
    <div aria-label="IGNAI 内容后台" className="ignai-admin-brand ignai-admin-brand--logo">
      <span aria-hidden="true" className="ignai-admin-brand__mark" />
      <span className="ignai-admin-brand__name">IGNAI</span>
      <span className="ignai-admin-brand__context">内容后台</span>
    </div>
  )
}

export function AdminIcon() {
  return (
    <span aria-label="IGNAI" className="ignai-admin-brand ignai-admin-brand--icon">
      <span aria-hidden="true" className="ignai-admin-brand__mark" />
    </span>
  )
}
