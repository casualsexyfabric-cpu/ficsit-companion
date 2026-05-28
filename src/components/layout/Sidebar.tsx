import { NavLink } from 'react-router-dom'
import {
  Zap,
  Factory,
  Package,
  Users,
  Map,
  Train,
  Bell,
  CheckSquare,
  BookOpen,
  BarChart2,
  Calculator,
} from 'lucide-react'

const realtimeLinks = [
  { to: '/electricidad', icon: Zap, label: 'Electricidad' },
  { to: '/fabricas', icon: Factory, label: 'Fábricas' },
  { to: '/contenedores', icon: Package, label: 'Contenedores' },
  { to: '/jugadores', icon: Users, label: 'Jugadores' },
  { to: '/mapa', icon: Map, label: 'Mapa' },
  { to: '/trenes', icon: Train, label: 'Trenes' },
  { to: '/alertas', icon: Bell, label: 'Alertas' },
]

const toolLinks = [
  { to: '/tareas', icon: CheckSquare, label: 'Tareas' },
  { to: '/investigacion', icon: BookOpen, label: 'Investigación' },
  { to: '/historial', icon: BarChart2, label: 'Historial' },
  { to: '/calculadora', icon: Calculator, label: 'Calculadora' },
]

interface NavItemProps {
  to: string
  icon: React.ElementType
  label: string
}

function NavItem({ to, icon: Icon, label }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded text-sm font-rajdhani font-medium transition-colors ${
          isActive
            ? 'bg-accent/20 text-accent border border-accent/30'
            : 'text-gray-400 hover:text-gray-100 hover:bg-surface-200'
        }`
      }
    >
      <Icon size={16} />
      <span>{label}</span>
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <aside className="w-52 bg-surface-100 border-r border-surface-300 flex flex-col py-4 px-3 gap-6 overflow-y-auto">
      <div>
        <p className="text-xs font-rajdhani font-semibold text-gray-600 uppercase tracking-widest mb-2 px-3">
          Tiempo real
        </p>
        <nav className="flex flex-col gap-1">
          {realtimeLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>
      </div>

      <div>
        <p className="text-xs font-rajdhani font-semibold text-gray-600 uppercase tracking-widest mb-2 px-3">
          Herramientas
        </p>
        <nav className="flex flex-col gap-1">
          {toolLinks.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>
      </div>
    </aside>
  )
}