import { useState } from 'react'
import { Factory, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Card, Badge, ProgressBar, StatBlock } from '@/components/ui'
import { useFactories } from '@/hooks/useSatisfactoryAPI'
import { mockMachines } from '@/lib/mockData'
import { useAppStore } from '@/store'
import type { FRMMachine } from '@/types'

type FilterType = 'all' | 'stopped' | 'underproducing' | 'operative'

function getMachineStatus(machine: FRMMachine): 'operative' | 'underproducing' | 'stopped' {
  if (machine.IsPaused || !machine.IsConfigured) return 'stopped'
  if (machine.Productivity < 95) return 'underproducing'
  return 'operative'
}

function StatusBadge({ status }: { status: ReturnType<typeof getMachineStatus> }) {
  if (status === 'operative') return <Badge variant="ok">Operativa</Badge>
  if (status === 'underproducing') return <Badge variant="warn">Infraproduciendo</Badge>
  return <Badge variant="error">Parada</Badge>
}

function MachineRow({ machine }: { machine: FRMMachine }) {
  const [expanded, setExpanded] = useState(false)
  const status = getMachineStatus(machine)
  const primaryProduct = machine.production[0]

  return (
    <div className="border-b border-surface-300/50 last:border-0">
      <div
        className="flex items-center gap-4 px-4 py-3 hover:bg-surface-200/50 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-rajdhani font-semibold text-gray-100 text-sm">
              {machine.Name}
            </span>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-gray-500">
            {machine.Recipe || 'Sin receta configurada'}
            {primaryProduct && ` → ${primaryProduct.Name}`}
          </p>
        </div>

        <div className="w-40 hidden md:block">
          <ProgressBar value={machine.Productivity} max={100} showLabel />
        </div>

        <div className="text-right shrink-0">
          <span className="font-mono text-sm text-gray-300">
            {machine.PowerInfo.PowerConsumed.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500 ml-1">MW</span>
        </div>

        {expanded ? (
          <ChevronUp size={14} className="text-gray-500 shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-gray-500 shrink-0" />
        )}
      </div>

      {expanded && (
        <div className="px-4 pb-4 bg-surface-200/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
            {/* Producción */}
            <div>
              <p className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider mb-2">
                Producción
              </p>
              {machine.production.map((item) => (
                <div key={item.ClassName} className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-300">{item.Name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-100">
                      {item.CurrentProd.toFixed(1)}
                    </span>
                    <span className="text-gray-600">/</span>
                    <span className="font-mono text-gray-500">
                      {item.MaxProd.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-600">/min</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Ingredientes */}
            <div>
              <p className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider mb-2">
                Ingredientes
              </p>
              {machine.ingredients.map((item) => (
                <div key={item.ClassName} className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-300">{item.Name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-gray-100">
                      {item.CurrentConsumed.toFixed(1)}
                    </span>
                    <span className="text-gray-600">/</span>
                    <span className="font-mono text-gray-500">
                      {item.MaxConsumed.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-600">/min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Posibles problemas */}
          {status !== 'operative' && (
            <div className="mt-3 pt-3 border-t border-surface-300/50">
              <p className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider mb-2">
                Diagnóstico
              </p>
              <div className="flex flex-col gap-1">
                {machine.IsPaused && (
                  <div className="flex items-center gap-2 text-xs text-status-error">
                    <XCircle size={12} />
                    <span>Máquina pausada manualmente</span>
                  </div>
                )}
                {!machine.IsConfigured && (
                  <div className="flex items-center gap-2 text-xs text-status-warn">
                    <AlertTriangle size={12} />
                    <span>Sin receta configurada</span>
                  </div>
                )}
                {machine.ingredients.some((i) => i.CurrentConsumed === 0 && i.MaxConsumed > 0) && (
                  <div className="flex items-center gap-2 text-xs text-status-warn">
                    <AlertTriangle size={12} />
                    <span>Sin materiales de entrada</span>
                  </div>
                )}
                {machine.production.some((p) => p.CurrentProd === 0 && p.MaxProd > 0 && !machine.IsPaused) && (
                  <div className="flex items-center gap-2 text-xs text-status-warn">
                    <AlertTriangle size={12} />
                    <span>Salida bloqueada o llena</span>
                  </div>
                )}
                {status === 'operative' && (
                  <div className="flex items-center gap-2 text-xs text-status-ok">
                    <CheckCircle size={12} />
                    <span>Funcionando correctamente</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Coordenadas */}
          <div className="mt-2 text-xs font-mono text-gray-600">
            X: {machine.location.x.toFixed(0)} Y: {machine.location.y.toFixed(0)} Z: {machine.location.z.toFixed(0)}
          </div>
        </div>
      )}
    </div>
  )
}

export function Fabricas() {
  const { data: liveData } = useFactories()
  const settings = useAppStore((s) => s.settings)
  const [filter, setFilter] = useState<FilterType>('all')

  const machines = liveData ?? (settings.apiUrl ? [] : mockMachines)

  const operative = machines.filter((m) => getMachineStatus(m) === 'operative')
  const underproducing = machines.filter((m) => getMachineStatus(m) === 'underproducing')
  const stopped = machines.filter((m) => getMachineStatus(m) === 'stopped')
  const avgEfficiency = machines.length > 0
    ? machines.reduce((acc, m) => acc + m.Productivity, 0) / machines.length
    : 0

  const filtered = filter === 'all' ? machines
    : filter === 'operative' ? operative
    : filter === 'underproducing' ? underproducing
    : stopped

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
            Monitor de Fábricas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {machines.length} máquinas monitorizadas
            {!liveData && <span className="text-accent ml-2">(datos de ejemplo)</span>}
          </p>
        </div>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card onClick={() => setFilter('operative')} className={filter === 'operative' ? 'border-status-ok' : ''}>
          <StatBlock label="Operativas" value={operative.length} sublabel="funcionando al 100%" />
          <div className="mt-2 w-2 h-2 rounded-full bg-status-ok" />
        </Card>
        <Card onClick={() => setFilter('underproducing')} className={filter === 'underproducing' ? 'border-status-warn' : ''}>
          <StatBlock label="Infraproduciendo" value={underproducing.length} sublabel="por debajo del 95%" />
          <div className="mt-2 w-2 h-2 rounded-full bg-status-warn" />
        </Card>
        <Card onClick={() => setFilter('stopped')} className={filter === 'stopped' ? 'border-status-error' : ''}>
          <StatBlock label="Paradas" value={stopped.length} sublabel="requieren atención" />
          <div className="mt-2 w-2 h-2 rounded-full bg-status-error" />
        </Card>
        <Card onClick={() => setFilter('all')} className={filter === 'all' ? 'border-accent' : ''}>
          <StatBlock label="Eficiencia media" value={avgEfficiency.toFixed(0)} unit="%" sublabel="global de la factoría" />
        </Card>
      </div>

      {/* Lista de máquinas */}
      <Card className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Factory size={15} className="text-accent" />
            <h2 className="font-rajdhani font-semibold text-gray-100">
              Máquinas
            </h2>
            <span className="text-xs text-gray-500">({filtered.length})</span>
          </div>
          <div className="flex gap-1">
            {(['all', 'operative', 'underproducing', 'stopped'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded text-xs font-rajdhani transition-colors ${
                  filter === f
                    ? 'bg-accent text-white'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-surface-200'
                }`}
              >
                {f === 'all' ? 'Todas' : f === 'operative' ? 'OK' : f === 'underproducing' ? 'Bajo' : 'Paradas'}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <CheckCircle size={32} className="text-gray-600" />
            <p className="font-rajdhani text-gray-500">No hay máquinas en este estado</p>
          </div>
        ) : (
          <div>
            {filtered.map((machine) => (
              <MachineRow key={machine.ID} machine={machine} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}