import { Zap, Battery, AlertTriangle } from 'lucide-react'
import { Card, StatBlock, ProgressBar, Badge } from '@/components/ui'
import { usePowerData } from '@/hooks/useSatisfactoryAPI'
import { mockPowerCircuits } from '@/lib/mockData'
import { useAppStore } from '@/store'
import type { FRMPowerCircuit } from '@/types'

function getBatteryStatus(circuit: FRMPowerCircuit) {
  if (circuit.BatteryCapacity === 0) return null
  if (circuit.BatteryDifferential > 0) return { label: 'Cargando', variant: 'ok' as const }
  if (circuit.BatteryDifferential < 0) return { label: 'Descargando', variant: 'warn' as const }
  return { label: 'Llena', variant: 'info' as const }
}

function getCircuitVariant(pct: number, fuse: boolean) {
  if (fuse) return 'error' as const
  if (pct >= 90) return 'error' as const
  if (pct >= 75) return 'warn' as const
  return 'ok' as const
}

export function Electricidad() {
  const { data: liveData } = usePowerData()
  const settings = useAppStore((s) => s.settings)

  const circuits = liveData ?? (settings.apiUrl ? [] : mockPowerCircuits)

  const totalConsumed = circuits.reduce((acc, c) => acc + c.PowerConsumed, 0)
  const totalCapacity = circuits.reduce((acc, c) => acc + c.PowerCapacity, 0)
  const totalProduction = circuits.reduce((acc, c) => acc + c.PowerProduction, 0)
  const totalReserve = totalCapacity - totalConsumed
  const globalPct = totalCapacity > 0 ? (totalConsumed / totalCapacity) * 100 : 0

  const hasBatteries = circuits.some((c) => c.BatteryCapacity > 0)
  const avgBatteryPct = hasBatteries
    ? circuits.filter((c) => c.BatteryCapacity > 0).reduce((acc, c) => acc + c.BatteryPercent, 0) /
      circuits.filter((c) => c.BatteryCapacity > 0).length
    : 0

  const fusedCircuits = circuits.filter((c) => c.FuseTriggered)

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
            Balance Eléctrico
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {circuits.length} circuito{circuits.length !== 1 ? 's' : ''} monitorizados
            {!liveData && <span className="text-accent ml-2">(datos de ejemplo)</span>}
          </p>
        </div>
        {fusedCircuits.length > 0 && (
          <div className="flex items-center gap-2 bg-status-error/10 border border-status-error/30 rounded-lg px-4 py-2">
            <AlertTriangle size={16} className="text-status-error" />
            <span className="font-rajdhani text-status-error font-semibold">
              {fusedCircuits.length} fusible{fusedCircuits.length > 1 ? 's' : ''} disparado{fusedCircuits.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <StatBlock
            label="Consumo actual"
            value={totalConsumed.toFixed(0)}
            unit="MW"
            sublabel={`${globalPct.toFixed(1)}% de capacidad`}
          />
        </Card>
        <Card>
          <StatBlock
            label="Capacidad total"
            value={totalCapacity.toFixed(0)}
            unit="MW"
            sublabel={`Producción: ${totalProduction.toFixed(0)} MW`}
          />
        </Card>
        <Card>
          <StatBlock
            label="Reserva disponible"
            value={totalReserve.toFixed(0)}
            unit="MW"
            sublabel={totalReserve < 0 ? '⚠ Déficit eléctrico' : 'Margen seguro'}
          />
        </Card>
        <Card>
          <StatBlock
            label="Baterías"
            value={hasBatteries ? avgBatteryPct.toFixed(0) : '—'}
            unit={hasBatteries ? '%' : ''}
            sublabel={hasBatteries ? 'Carga media' : 'Sin baterías'}
          />
        </Card>
      </div>

      {/* Tabla de circuitos */}
      <Card className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-300 flex items-center gap-2">
          <Zap size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">
            Circuitos eléctricos
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-300">
                <th className="text-left px-4 py-2.5 font-rajdhani text-gray-500 uppercase text-xs tracking-wider">Circuito</th>
                <th className="text-right px-4 py-2.5 font-rajdhani text-gray-500 uppercase text-xs tracking-wider">Consumo</th>
                <th className="text-right px-4 py-2.5 font-rajdhani text-gray-500 uppercase text-xs tracking-wider">Capacidad</th>
                <th className="text-left px-4 py-2.5 font-rajdhani text-gray-500 uppercase text-xs tracking-wider w-40">Uso</th>
                <th className="text-center px-4 py-2.5 font-rajdhani text-gray-500 uppercase text-xs tracking-wider">Estado</th>
                <th className="text-center px-4 py-2.5 font-rajdhani text-gray-500 uppercase text-xs tracking-wider">Batería</th>
              </tr>
            </thead>
            <tbody>
              {circuits.map((circuit) => {
                const pct = circuit.PowerCapacity > 0
                  ? (circuit.PowerConsumed / circuit.PowerCapacity) * 100
                  : 0
                const variant = getCircuitVariant(pct, circuit.FuseTriggered)
                const battery = getBatteryStatus(circuit)

                return (
                  <tr key={circuit.CircuitGroupID} className="border-b border-surface-300/50 hover:bg-surface-200/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-gray-300">
                      #{circuit.CircuitGroupID}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-100">
                      {circuit.PowerConsumed.toFixed(0)} <span className="text-gray-500 text-xs">MW</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-gray-400">
                      {circuit.PowerCapacity.toFixed(0)} <span className="text-gray-500 text-xs">MW</span>
                    </td>
                    <td className="px-4 py-3">
                      <ProgressBar value={pct} max={100} showLabel />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={variant}>
                        {circuit.FuseTriggered ? 'FUSIBLE' : variant === 'error' ? 'CRÍTICO' : variant === 'warn' ? 'ALTO' : 'OK'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {battery ? (
                        <Badge variant={battery.variant}>{battery.label}</Badge>
                      ) : (
                        <span className="text-gray-600 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detalle de baterías */}
      {hasBatteries && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Battery size={15} className="text-accent" />
            <h2 className="font-rajdhani font-semibold text-gray-100">
              Estado de baterías
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {circuits.filter((c) => c.BatteryCapacity > 0).map((circuit) => {
              const battery = getBatteryStatus(circuit)
              return (
                <div key={circuit.CircuitGroupID} className="flex flex-col gap-2 p-3 bg-surface-200 rounded">
                  <div className="flex items-center justify-between">
                    <span className="font-rajdhani text-gray-400 text-sm">Circuito #{circuit.CircuitGroupID}</span>
                    {battery && <Badge variant={battery.variant}>{battery.label}</Badge>}
                  </div>
                  <ProgressBar value={circuit.BatteryPercent} max={100} showLabel />
                  <div className="flex justify-between text-xs font-mono text-gray-500">
                    <span>Vacía: {circuit.BatteryTimeEmpty}</span>
                    <span>Llena: {circuit.BatteryTimeFull}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}