interface Props {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: Props) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 ${className}`}>
      {children}
    </div>
  )
}
