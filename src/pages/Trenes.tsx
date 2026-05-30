import { useState } from 'react'
import { Train, ChevronDown, ChevronUp, AlertTriangle, MapPin } from 'lucide-react'
import { Card, Badge, StatBlock } from '@/components/ui'
import { useTrains } from '@/hooks/useSatisfactoryAPI'
import { mockTrains } from '@/lib/mockData'
import { useAppStore } from '@/store'
import type { FRMTrain } from '@/types'

function getTrainStatus(train: FRMTrain): { label: string; variant: 'ok' | 'warn' | 'error' | 'info' } {
  if (train.Derailed) return { label: 'Descarrilado', variant: 'error' }
  switch (train.Status) {
    case 'TS_SelfDriving': return { label: 'En movimiento', variant: 'ok' }
    case 'TS_Parked': return { label: 'Estacionado', variant: 'info' }
    case 'TS_Loading': return { label: 'Cargando', variant: 'warn' }
    case 'TS_Unloading': return { label: 'Descargando', variant: 'warn' }
    case 'TS_Deadlock': return { label: 'Deadlock', variant: 'error' }
    default: return { label: train.Status ?? 'Desconocido', variant: 'info' }
  }
}

function TrainRow({ train }: { train: FRMTrain }) {
  const [expanded, setExpanded] = useState(false)
  const status = getTrainStatus(train)

  return (
    <div className="border-b border-surface-300/50 last:border-0">
      <div
        className="flex items-center gap-4 px-4 py-3 hover:bg-surface-200/50 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-rajdhani font-semibold text-gray-100 text-sm">
              {train.TrainName}
            </span>
            <Badge variant={status.variant}>{status.label}</Badge>
            {train.Derailed && (
              <AlertTriangle size={14} className="text-status-error animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={10} />
            <span>{train.TrainStation || 'En ruta'}</span>
            {train.TimeTable && train.TimeTable.length > 1 && (
              <>
                <span className="text-gray-600">→</span>
                <span>{train.TimeTable.find(s => s.StationName !== train.TrainStation)?.StationName ?? '...'}</span>
              </>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="font-mono text-sm text-gray-300">
            {train.PowerInfo.PowerConsumed.toFixed(0)}
          </span>
          <span className="text-xs text-gray-500 ml-1">MW</span>
        </div>

        {expanded
          ? <ChevronUp size={14} className="text-gray-500 shrink-0" />
          : <ChevronDown size={14} className="text-gray-500 shrink-0" />
        }
      </div>

      {expanded && (
        <div className="px-4 pb-4 bg-surface-200/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
            {/* Ruta */}
            {train.TimeTable && train.TimeTable.length > 0 && (
              <div>
                <p className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider mb-2">
                  Ruta
                </p>
                <div className="flex flex-col gap-1">
                  {train.TimeTable.map((stop, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        stop.StationName === train.TrainStation
                          ? 'bg-accent'
                          : 'bg-surface-400'
                      }`} />
                      <span className={`text-sm ${
                        stop.StationName === train.TrainStation
                          ? 'text-accent font-semibold'
                          : 'text-gray-400'
                      }`}>
                        {stop.StationName}
                      </span>
                      {stop.StationName === train.TrainStation && (
                        <Badge variant="accent">Actual</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vagones */}
            {train.Wagons && train.Wagons.length > 0 && (
              <div>
                <p className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider mb-2">
                  Vagones ({train.Wagons.length})
                </p>
                <div className="flex flex-col gap-2">
                  {train.Wagons.map((wagon, i) => (
                    <div key={i} className="p-2 bg-surface-200 rounded">
                      <p className="text-xs font-rajdhani text-gray-400 mb-1">{wagon.Name}</p>
                      {wagon.TotalInventory && wagon.TotalInventory.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {wagon.TotalInventory.map((item) => (
                            <div key={item.ClassName} className="flex items-center gap-1 bg-surface-300 rounded px-1.5 py-0.5">
                              <span className="text-xs text-gray-400">{item.Name}</span>
                              <span className="text-xs font-mono text-gray-100">{item.Amount}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600">Vacío</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 text-xs font-mono text-gray-600">
            X:{train.location.x.toFixed(0)} Y:{train.location.y.toFixed(0)} Z:{train.location.z.toFixed(0)}
          </div>
        </div>
      )}
    </div>
  )
}

export function Trenes() {
  const { data: liveData } = useTrains()
  const settings = useAppStore((s) => s.settings)

  const trains = liveData ?? (settings.apiUrl ? [] : mockTrains)

  const moving = trains.filter((t) => t.Status === 'TS_SelfDriving' && !t.Derailed)
  const loading = trains.filter((t) => ['TS_Loading', 'TS_Unloading'].includes(t.Status ?? '') && !t.Derailed)
  const stopped = trains.filter((t) => t.Status === 'TS_Parked' && !t.Derailed)
  const deadlocks = trains.filter((t) => t.Derailed || t.Status === 'TS_Deadlock')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
          Monitor de Trenes
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {trains.length} tren{trains.length !== 1 ? 'es' : ''} en la red ferroviaria
          {!liveData && <span className="text-accent ml-2">(datos de ejemplo)</span>}
        </p>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <StatBlock label="En movimiento" value={moving.length} sublabel="autopilot activo" />
          <div className="mt-2 w-2 h-2 rounded-full bg-status-ok" />
        </Card>
        <Card>
          <StatBlock label="Cargando/descargando" value={loading.length} sublabel="en estación" />
          <div className="mt-2 w-2 h-2 rounded-full bg-status-warn" />
        </Card>
        <Card>
          <StatBlock label="Estacionados" value={stopped.length} sublabel="sin movimiento" />
          <div className="mt-2 w-2 h-2 rounded-full bg-status-info" />
        </Card>
        <Card className={deadlocks.length > 0 ? 'border-status-error' : ''}>
          <StatBlock label="Deadlocks" value={deadlocks.length} sublabel={deadlocks.length > 0 ? '¡Requiere atención!' : 'Sin problemas'} />
          <div className={`mt-2 w-2 h-2 rounded-full ${deadlocks.length > 0 ? 'bg-status-error animate-pulse' : 'bg-gray-600'}`} />
        </Card>
      </div>

      {/* Alerta de deadlock */}
      {deadlocks.length > 0 && (
        <div className="flex items-center gap-3 bg-status-error/10 border border-status-error/30 rounded-lg px-4 py-3">
          <AlertTriangle size={16} className="text-status-error shrink-0" />
          <div>
            <p className="font-rajdhani font-semibold text-status-error">
              {deadlocks.length} tren{deadlocks.length > 1 ? 'es' : ''} con deadlock detectado
            </p>
            <p className="text-xs text-gray-500">
              {deadlocks.map((t) => t.TrainName).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Lista de trenes */}
      <Card className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-300 flex items-center gap-2">
          <Train size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">
            Trenes ({trains.length})
          </h2>
        </div>
        {trains.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Train size={32} className="text-gray-600" />
            <p className="font-rajdhani text-gray-500">No hay trenes en la red</p>
          </div>
        ) : (
          <div>
            {trains.map((train) => (
              <TrainRow key={train.TrainName} train={train} />
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}