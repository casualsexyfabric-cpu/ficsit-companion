import { useState } from 'react'
import { Users, Search, Heart, MapPin } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { usePlayers, useContainers } from '@/hooks/useSatisfactoryAPI'
import { mockPlayers, mockContainers } from '@/lib/mockData'
import { useAppStore } from '@/store'
import type { FRMPlayer } from '@/types'

function PlayerAvatar({ name, online }: { name: string; online: boolean }) {
  const initials = name.slice(0, 2).toUpperCase()
  return (
    <div className="relative shrink-0">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-rajdhani font-bold text-lg ${
        online ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-surface-300 text-gray-500 border border-surface-400'
      }`}>
        {initials}
      </div>
      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-100 ${
        online ? 'bg-status-ok' : 'bg-gray-600'
      }`} />
    </div>
  )
}

function HealthBar({ current, max }: { current: number; max: number }) {
  const pct = max > 0 ? (current / max) * 100 : 0
  const color = pct > 60 ? 'bg-status-ok' : pct > 30 ? 'bg-status-warn' : 'bg-status-error'
  return (
    <div className="flex items-center gap-2">
      <Heart size={12} className={pct > 30 ? 'text-status-ok' : 'text-status-error'} />
      <div className="flex-1 h-1.5 bg-surface-300 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-gray-400">{current}/{max}</span>
    </div>
  )
}

function PlayerCard({ player }: { player: FRMPlayer }) {
  return (
    <Card>
      <div className="flex items-start gap-4 mb-4">
        <PlayerAvatar name={player.Name} online={player.Online} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-rajdhani font-bold text-gray-100 text-lg">{player.Name}</span>
            <Badge variant={player.Online ? 'ok' : 'default'}>
              {player.Online ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <HealthBar current={player.PlayerHP} max={100} />
        </div>
      </div>

      {/* Localización */}
      <div className="flex items-center gap-1.5 mb-3 text-xs font-mono text-gray-500">
        <MapPin size={11} className="text-accent" />
        X:{player.location.x.toFixed(0)} Y:{player.location.y.toFixed(0)} Z:{player.location.z.toFixed(0)}
      </div>

      {/* Inventario */}
      {player.Inventory && player.Inventory.length > 0 ? (
        <div>
          <p className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider mb-2">
            Inventario
          </p>
          <div className="flex flex-wrap gap-2">
            {player.Inventory.map((item) => (
              <div key={item.ClassName} className="flex items-center gap-1.5 bg-surface-200 rounded px-2 py-1">
                <span className="text-xs text-gray-400">{item.Name}</span>
                <span className="text-xs font-mono text-gray-100">{item.Amount}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-600">Inventario vacío</p>
      )}
    </Card>
  )
}

export function Jugadores() {
  const { data: livePlayers } = usePlayers()
  const { data: liveContainers } = useContainers()
  const settings = useAppStore((s) => s.settings)
  const [search, setSearch] = useState('')

  const players = livePlayers ?? (settings.apiUrl ? [] : mockPlayers)
  const containers = liveContainers ?? (settings.apiUrl ? [] : mockContainers)

  // Buscador ¿Quién tiene X?
  const searchResults = search.trim()
    ? [
        ...players.flatMap((p) =>
          (p.Inventory ?? [])
            .filter((i) => i.Name.toLowerCase().includes(search.toLowerCase()))
            .map((i) => ({ source: p.Name, type: 'player' as const, item: i, location: p.location }))
        ),
        ...containers.flatMap((c) =>
          c.Inventory
            .filter((i) => i.Name.toLowerCase().includes(search.toLowerCase()))
            .map((i) => ({ source: c.Name, type: 'container' as const, item: i, location: c.location }))
        ),
      ].sort((a, b) => b.item.Amount - a.item.Amount)
    : []

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
          Panel de Jugadores
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {players.filter((p) => p.Online).length} de {players.length} jugadores online
          {!livePlayers && <span className="text-accent ml-2">(datos de ejemplo)</span>}
        </p>
      </div>

      {/* Cards de jugadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map((player) => (
          <PlayerCard key={player.ID} player={player} />
        ))}
        {players.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-12 gap-3">
            <Users size={32} className="text-gray-600" />
            <p className="font-rajdhani text-gray-500">No hay jugadores conectados</p>
          </div>
        )}
      </div>

      {/* Buscador ¿Quién tiene X? */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Search size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">¿Quién tiene X?</h2>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Busca un recurso y la app cruza el inventario de todos los jugadores y contenedores
        </p>
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
            {searchResults.map((result, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-surface-200 rounded">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-rajdhani font-semibold text-gray-100 text-sm">
                      {result.item.Name}
                    </span>
                    <Badge variant={result.type === 'player' ? 'accent' : 'default'}>
                      {result.type === 'player' ? 'Jugador' : 'Contenedor'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{result.source}</p>
                  <p className="text-xs font-mono text-gray-600">
                    X:{result.location.x.toFixed(0)} Y:{result.location.y.toFixed(0)} Z:{result.location.z.toFixed(0)}
                  </p>
                </div>
                <span className="font-mono text-xl text-gray-100">{result.item.Amount}</span>
              </div>
            ))}
          </div>
        )}

        {search && searchResults.length === 0 && (
          <p className="mt-3 text-sm text-gray-500 text-center py-4">
            Nadie tiene "{search}"
          </p>
        )}
      </Card>
    </div>
  )
}