import { useState } from 'react'
import { Package, Search } from 'lucide-react'
import { Card, StatBlock, Badge } from '@/components/ui'
import { useContainers } from '@/hooks/useSatisfactoryAPI'
import { mockContainers } from '@/lib/mockData'
import { useAppStore } from '@/store'
import type { FRMContainer, FRMInventoryItem } from '@/types'

function getFillPercentage(container: FRMContainer): number {
  // FRM no devuelve capacidad máxima directamente, estimamos por tipo
  const maxSlots = 48
  const totalItems = container.Inventory.reduce((acc, i) => acc + i.Amount, 0)
  return Math.min((totalItems / (maxSlots * 100)) * 100, 100)
}

function FillBar({ percentage }: { percentage: number }) {
  const color = percentage >= 90 ? 'bg-status-error' : percentage >= 70 ? 'bg-status-warn' : 'bg-status-ok'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-300 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-xs font-mono text-gray-400 w-8 text-right">{percentage.toFixed(0)}%</span>
    </div>
  )
}

export function Contenedores() {
  const { data: liveData } = useContainers()
  const settings = useAppStore((s) => s.settings)
  const [search, setSearch] = useState('')

  const containers = liveData ?? (settings.apiUrl ? [] : mockContainers)

  // Totales globales por recurso
  const globalTotals = new Map<string, FRMInventoryItem>()
  containers.forEach((container) => {
    container.Inventory.forEach((item) => {
      const existing = globalTotals.get(item.ClassName)
      if (existing) {
        existing.Amount += item.Amount
      } else {
        globalTotals.set(item.ClassName, { ...item })
      }
    })
  })
  const sortedTotals = Array.from(globalTotals.values()).sort((a, b) => b.Amount - a.Amount)

  // Filtrado por búsqueda
  const filteredContainers = search.trim()
    ? containers.filter((c) =>
        c.Name.toLowerCase().includes(search.toLowerCase()) ||
        c.Inventory.some((i) => i.Name.toLowerCase().includes(search.toLowerCase()))
      )
    : containers

  const searchResults = search.trim()
    ? containers.flatMap((c) =>
        c.Inventory
          .filter((i) => i.Name.toLowerCase().includes(search.toLowerCase()))
          .map((i) => ({ container: c, item: i }))
      ).sort((a, b) => b.item.Amount - a.item.Amount)
    : []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
          Inventario de Contenedores
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {containers.length} contenedores · {sortedTotals.length} recursos distintos
          {!liveData && <span className="text-accent ml-2">(datos de ejemplo)</span>}
        </p>
      </div>

      {/* Buscador */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Search size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">¿Dónde está X?</h2>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar recurso... (ej: Iron Plate, Cable)"
            className="w-full bg-surface-200 border border-surface-400 rounded px-3 py-2 pl-9 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        {search && searchResults.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {searchResults.map(({ container, item }) => (
              <div key={`${container.ID}-${item.ClassName}`} className="flex items-center justify-between p-3 bg-surface-200 rounded">
                <div>
                  <span className="font-rajdhani font-semibold text-gray-100 text-sm">{item.Name}</span>
                  <p className="text-xs text-gray-500">{container.Name}</p>
                  <p className="text-xs font-mono text-gray-600">
                    X:{container.location.x.toFixed(0)} Y:{container.location.y.toFixed(0)} Z:{container.location.z.toFixed(0)}
                  </p>
                </div>
                <span className="font-mono text-lg text-gray-100">{item.Amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        {search && searchResults.length === 0 && (
          <p className="mt-3 text-sm text-gray-500 text-center py-4">
            No se encontró "{search}" en ningún contenedor
          </p>
        )}
      </Card>

      {/* Totales globales */}
      <Card className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-300 flex items-center gap-2">
          <Package size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">Totales globales</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 divide-x divide-y divide-surface-300/50">
          {sortedTotals.map((item) => (
            <div key={item.ClassName} className="p-3">
              <p className="text-xs text-gray-500 truncate">{item.Name}</p>
              <p className="font-mono text-lg text-gray-100">{item.Amount.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Lista de contenedores */}
      <Card className="p-0 overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-300 flex items-center gap-2">
          <Package size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">
            Contenedores ({filteredContainers.length})
          </h2>
        </div>
        <div className="divide-y divide-surface-300/50">
          {filteredContainers.map((container) => {
            const fill = getFillPercentage(container)
            return (
              <div key={container.ID} className="px-4 py-3">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-rajdhani font-semibold text-gray-100 text-sm">
                        {container.Name}
                      </span>
                      {fill >= 90 && <Badge variant="error">Lleno</Badge>}
                    </div>
                    <p className="text-xs font-mono text-gray-600">
                      X:{container.location.x.toFixed(0)} Y:{container.location.y.toFixed(0)} Z:{container.location.z.toFixed(0)}
                    </p>
                  </div>
                  <div className="w-32 shrink-0">
                    <FillBar percentage={fill} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {container.Inventory.map((item) => (
                    <div key={item.ClassName} className="flex items-center gap-1.5 bg-surface-200 rounded px-2 py-1">
                      <span className="text-xs text-gray-400">{item.Name}</span>
                      <span className="text-xs font-mono text-gray-100">{item.Amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}