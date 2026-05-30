import { Bell, BellOff, Trash2, Settings2, Factory, Zap, Package, Train } from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { useAppStore } from '@/store'
import type { AlertType } from '@/types'

function getAlertIcon(type: AlertType) {
  switch (type) {
    case 'factory_stopped':
    case 'factory_underproducing':
      return Factory
    case 'circuit_critical':
      return Zap
    case 'container_full':
      return Package
    case 'train_deadlock':
      return Train
    default:
      return Bell
  }
}

function getAlertVariant(type: AlertType) {
  switch (type) {
    case 'factory_stopped':
    case 'circuit_critical':
    case 'train_deadlock':
      return 'error' as const
    case 'factory_underproducing':
    case 'container_full':
      return 'warn' as const
    default:
      return 'info' as const
  }
}

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `hace ${seconds}s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  return `hace ${hours}h`
}

export function Alertas() {
  const alerts = useAppStore((s) => s.alerts)
  const alertConfig = useAppStore((s) => s.alertConfig)
  const setAlertConfig = useAppStore((s) => s.setAlertConfig)
  const dismissAlert = useAppStore((s) => s.dismissAlert)
  const clearAlerts = useAppStore((s) => s.clearAlerts)

  const activeAlerts = alerts.filter((a) => a.isActive)

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
            Sistema de Alertas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {activeAlerts.length} alerta{activeAlerts.length !== 1 ? 's' : ''} activa{activeAlerts.length !== 1 ? 's' : ''}
          </p>
        </div>
        {alerts.length > 0 && (
          <Button variant="danger" onClick={clearAlerts}>
            <Trash2 size={14} />
            Limpiar todas
          </Button>
        )}
      </div>

      {/* Lista de alertas activas */}
      <Card className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-300 flex items-center gap-2">
          <Bell size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">
            Alertas activas
          </h2>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
            <BellOff size={32} className="text-gray-600" />
            <p className="font-rajdhani text-gray-500">
              No hay alertas activas
            </p>
            <p className="text-xs text-gray-600">
              Todo funciona correctamente
            </p>
          </div>
        ) : (
          <div className="divide-y divide-surface-300/50">
            {activeAlerts.map((alert) => {
              const Icon = getAlertIcon(alert.type)
              const variant = getAlertVariant(alert.type)
              return (
                <div key={alert.id} className="flex items-start gap-4 px-4 py-3 hover:bg-surface-200/50 transition-colors">
                  <div className={`mt-0.5 p-1.5 rounded ${
                    variant === 'error' ? 'bg-status-error/10' :
                    variant === 'warn' ? 'bg-status-warn/10' : 'bg-status-info/10'
                  }`}>
                    <Icon size={14} className={
                      variant === 'error' ? 'text-status-error' :
                      variant === 'warn' ? 'text-status-warn' : 'text-status-info'
                    } />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-rajdhani font-semibold text-gray-100 text-sm">
                        {alert.title}
                      </span>
                      <Badge variant={variant}>{alert.affectedElement}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">{alert.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-gray-600">
                      {timeAgo(new Date(alert.detectedAt))}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Configuración de alertas */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Settings2 size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">
            Configuración de alertas
          </h2>
        </div>

        <div className="flex flex-col gap-5">
          {/* Fábricas */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider">
              Fábricas
            </p>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Máquina parada</span>
              <input
                type="checkbox"
                checked={alertConfig.factory_stopped}
                onChange={(e) => setAlertConfig({ factory_stopped: e.target.checked })}
                className="accent-[#E8630A] w-4 h-4"
              />
            </label>
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={alertConfig.factory_underproducing}
                  onChange={(e) => setAlertConfig({ factory_underproducing: e.target.checked })}
                  className="accent-[#E8630A] w-4 h-4"
                />
                <span className="text-sm text-gray-300">Infraproduciendo por debajo de</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={alertConfig.factory_underproducing_threshold}
                  onChange={(e) => setAlertConfig({ factory_underproducing_threshold: Number(e.target.value) })}
                  className="w-16 bg-surface-200 border border-surface-400 rounded px-2 py-1 text-sm font-mono text-gray-100 text-center focus:outline-none focus:border-accent"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-surface-300" />

          {/* Electricidad */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider">
              Electricidad
            </p>
            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={alertConfig.circuit_critical}
                  onChange={(e) => setAlertConfig({ circuit_critical: e.target.checked })}
                  className="accent-[#E8630A] w-4 h-4"
                />
                <span className="text-sm text-gray-300">Circuito crítico por encima de</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={alertConfig.circuit_critical_threshold}
                  onChange={(e) => setAlertConfig({ circuit_critical_threshold: Number(e.target.value) })}
                  className="w-16 bg-surface-200 border border-surface-400 rounded px-2 py-1 text-sm font-mono text-gray-100 text-center focus:outline-none focus:border-accent"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-surface-300" />

          {/* Otros */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider">
              Otros
            </p>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Contenedor lleno</span>
              <input
                type="checkbox"
                checked={alertConfig.container_full}
                onChange={(e) => setAlertConfig({ container_full: e.target.checked })}
                className="accent-[#E8630A] w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Deadlock de tren</span>
              <input
                type="checkbox"
                checked={alertConfig.train_deadlock}
                onChange={(e) => setAlertConfig({ train_deadlock: e.target.checked })}
                className="accent-[#E8630A] w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Milestone listo para entregar</span>
              <input
                type="checkbox"
                checked={alertConfig.milestone_ready}
                onChange={(e) => setAlertConfig({ milestone_ready: e.target.checked })}
                className="accent-[#E8630A] w-4 h-4"
              />
            </label>
          </div>
        </div>
      </Card>
    </div>
  )
}