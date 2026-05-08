export default function FloatingLeaves() {
  return (
    <div className="floating-leaves" aria-hidden="true">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="leaf" />
      ))}
    </div>
  )
}
