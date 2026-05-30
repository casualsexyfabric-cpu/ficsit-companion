import { BarChart2, Zap, TrendingUp } from 'lucide-react'
import { Card, StatBlock } from '@/components/ui'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts'

const mockPowerHistory = [
  { time: '20:00', consumo: 1200, capacidad: 2100 },
  { time: '20:15', consumo: 1350, capacidad: 2100 },
  { time: '20:30', consumo: 1500, capacidad: 2100 },
  { time: '20:45', consumo: 1480, capacidad: 2100 },
  { time: '21:00', consumo: 1600, capacidad: 2100 },
  { time: '21:15', consumo: 1720, capacidad: 2100 },
  { time: '21:30', consumo: 1718, capacidad: 2100 },
]

const mockProductionHistory = [
  { time: '20:00', 'Iron Plate': 120, 'Wire': 240, 'Cable': 80 },
  { time: '20:15', 'Iron Plate': 135, 'Wire': 260, 'Cable': 90 },
  { time: '20:30', 'Iron Plate': 140, 'Wire': 280, 'Cable': 95 },
  { time: '20:45', 'Iron Plate': 138, 'Wire': 275, 'Cable': 92 },
  { time: '21:00', 'Iron Plate': 150, 'Wire': 300, 'Cable': 100 },
  { time: '21:15', 'Iron Plate': 155, 'Wire': 310, 'Cable': 105 },
  { time: '21:30', 'Iron Plate': 160, 'Wire': 320, 'Cable': 110 },
]

const mockTopItems = [
  { name: 'Wire', total: 1985 },
  { name: 'Iron Plate', total: 998 },
  { name: 'Cable', total: 672 },
  { name: 'Iron Ingot', total: 450 },
  { name: 'Copper Ingot', total: 320 },
]

const COLORS = ['#E8630A', '#22C55E', '#3B82F6', '#EAB308', '#EF4444']

const tooltipStyle = {
  backgroundColor: '#1A1A1A',
  border: '1px solid #2E2E2E',
  borderRadius: '6px',
  color: '#E5E7EB',
  fontFamily: 'Share Tech Mono',
  fontSize: '12px',
}

export function Historial() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
          Historial de Producción
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Evolución de la factoría durante la sesión actual
          <span className="text-accent ml-2">(datos de ejemplo)</span>
        </p>
      </div>

      {/* Stats de sesión */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <StatBlock label="Duración sesión" value="1h 30m" sublabel="tiempo jugado" />
        </Card>
        <Card>
          <StatBlock label="Pico de consumo" value="1720" unit="MW" sublabel="a las 21:15" />
        </Card>
        <Card>
          <StatBlock label="Items producidos" value="3.655" sublabel="esta sesión" />
        </Card>
        <Card>
          <StatBlock label="Eficiencia media" value="76" unit="%" sublabel="global de fábricas" />
        </Card>
      </div>

      {/* Gráfica consumo eléctrico */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Zap size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">
            Consumo eléctrico — Sesión actual
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={mockPowerHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
            <XAxis dataKey="time" stroke="#6B7280" tick={{ fontSize: 11, fontFamily: 'Share Tech Mono' }} />
            <YAxis stroke="#6B7280" tick={{ fontSize: 11, fontFamily: 'Share Tech Mono' }} unit=" MW" />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="consumo" stroke="#E8630A" strokeWidth={2} dot={false} name="Consumo" />
            <Line type="monotone" dataKey="capacidad" stroke="#2E2E2E" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Capacidad" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Gráfica producción */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">
            Producción por item — Sesión actual
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={mockProductionHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" />
            <XAxis dataKey="time" stroke="#6B7280" tick={{ fontSize: 11, fontFamily: 'Share Tech Mono' }} />
            <YAxis stroke="#6B7280" tick={{ fontSize: 11, fontFamily: 'Share Tech Mono' }} unit="/m" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'Share Tech Mono' }} />
            <Line type="monotone" dataKey="Iron Plate" stroke="#E8630A" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Wire" stroke="#22C55E" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Cable" stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Top items */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">
            Top items producidos
          </h2>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mockTopItems} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#2E2E2E" horizontal={false} />
            <XAxis type="number" stroke="#6B7280" tick={{ fontSize: 11, fontFamily: 'Share Tech Mono' }} />
            <YAxis type="category" dataKey="name" stroke="#6B7280" tick={{ fontSize: 11, fontFamily: 'Share Tech Mono' }} width={80} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="total" fill="#E8630A" radius={[0, 4, 4, 0]} name="Total producido" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}