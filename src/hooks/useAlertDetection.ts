import { useEffect } from 'react'
import { useAppStore } from '@/store'
import { usePowerData, useFactories } from '@/hooks/useSatisfactoryAPI'
import { mockPowerCircuits, mockMachines } from '@/lib/mockData'
import type { Alert } from '@/types'

function generateId(type: string, element: string) {
  return `${type}_${element}`
}

export function useAlertDetection() {
  const { data: livepower } = usePowerData()
  const { data: liveFactories } = useFactories()

  const settings = useAppStore((s) => s.settings)
  const alertConfig = useAppStore((s) => s.alertConfig)
  const addAlert = useAppStore((s) => s.addAlert)
  const dismissAlert = useAppStore((s) => s.dismissAlert)
  const alerts = useAppStore((s) => s.alerts)

  const circuits = livepower ?? (settings.apiUrl ? [] : mockPowerCircuits)
  const machines = liveFactories ?? (settings.apiUrl ? [] : mockMachines)

  useEffect(() => {
    const newAlerts: Alert[] = []

    if (alertConfig.circuit_critical) {
      circuits.forEach((circuit) => {
        const pct = circuit.PowerCapacity > 0
          ? (circuit.PowerConsumed / circuit.PowerCapacity) * 100
          : 0

        if (circuit.FuseTriggered) {
          newAlerts.push({
            id: generateId('fuse', String(circuit.CircuitGroupID)),
            type: 'circuit_critical',
            title: 'Fusible disparado',
            description: `El circuito #${circuit.CircuitGroupID} ha disparado el fusible`,
            affectedElement: `Circuito #${circuit.CircuitGroupID}`,
            detectedAt: new Date(),
            isActive: true,
          })
        } else if (pct >= alertConfig.circuit_critical_threshold) {
          newAlerts.push({
            id: generateId('circuit_critical', String(circuit.CircuitGroupID)),
            type: 'circuit_critical',
            title: 'Circuito crítico',
            description: `Circuito #${circuit.CircuitGroupID} al ${pct.toFixed(0)}% de capacidad`,
            affectedElement: `Circuito #${circuit.CircuitGroupID}`,
            detectedAt: new Date(),
            isActive: true,
          })
        }
      })
    }

    machines.forEach((machine) => {
      if (alertConfig.factory_stopped && machine.IsPaused && machine.IsConfigured) {
        newAlerts.push({
          id: generateId('factory_stopped', machine.ID),
          type: 'factory_stopped',
          title: 'Máquina parada',
          description: `${machine.Name} (${machine.Recipe}) está parada`,
          affectedElement: machine.Name,
          detectedAt: new Date(),
          isActive: true,
        })
      }

      if (
        alertConfig.factory_underproducing &&
        machine.IsProducing &&
        machine.Productivity < alertConfig.factory_underproducing_threshold &&
        machine.Productivity > 0
      ) {
        newAlerts.push({
          id: generateId('factory_underproducing', machine.ID),
          type: 'factory_underproducing',
          title: 'Infraproduciendo',
          description: `${machine.Name} (${machine.Recipe}) al ${machine.Productivity.toFixed(0)}% de eficiencia`,
          affectedElement: machine.Name,
          detectedAt: new Date(),
          isActive: true,
        })
      }
    })

    const newAlertIds = new Set(newAlerts.map((a) => a.id))
    alerts.forEach((a) => {
      if (!newAlertIds.has(a.id)) dismissAlert(a.id)
    })
    newAlerts.forEach((a) => addAlert(a))
  }, [circuits, machines, alertConfig])
}