import { useState, useEffect } from 'react'
import { MapContainer, ImageOverlay, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Factory, Users, Train, Layers } from 'lucide-react'
import { Card, Badge } from '@/components/ui'
import { usePlayers, useFactories, useTrains } from '@/hooks/useSatisfactoryAPI'
import { mockPlayers, mockMachines, mockTrains } from '@/lib/mockData'
import { useAppStore } from '@/store'
import { gameToLatLng, LEAFLET_BOUNDS, MAP_CENTER, MAP_IMAGE_SIZE } from '@/lib/mapUtils'

// URL de la imagen del mapa de Satisfactory (imagen pública)
const MAP_IMAGE_URL = '/map.jpg'

// Iconos personalizados para Leaflet
function createIcon(color: string, emoji: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      background: ${color};
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    ">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

const playerIcon = createIcon('#E8630A', '👤')
const factoryIcon = createIcon('#3B82F6', '🏭')
const trainIcon = createIcon('#22C55E', '🚂')

// Fix para los iconos por defecto de Leaflet en Vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '',
  iconUrl: '',
  shadowUrl: '',
})

function MapController() {
  const map = useMap()
  useEffect(() => {
    map.setMaxBounds(LEAFLET_BOUNDS)
  }, [map])
  return null
}

interface LayerConfig {
  factories: boolean
  players: boolean
  trains: boolean
}

export function Mapa() {
  const { data: livePlayers } = usePlayers()
  const { data: liveFactories } = useFactories()
  const { data: liveTrains } = useTrains()
  const settings = useAppStore((s) => s.settings)

  const players = livePlayers ?? (settings.apiUrl ? [] : mockPlayers)
  const machines = liveFactories ?? (settings.apiUrl ? [] : mockMachines)
  const trains = liveTrains ?? (settings.apiUrl ? [] : mockTrains)

  const [layers, setLayers] = useState<LayerConfig>({
    factories: true,
    players: true,
    trains: true,
  })

  function toggleLayer(layer: keyof LayerConfig) {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
            Mapa en Tiempo Real
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {players.length} jugadores · {machines.length} máquinas · {trains.length} trenes
            {!livePlayers && <span className="text-accent ml-2">(datos de ejemplo)</span>}
          </p>
        </div>

        {/* Controles de capas */}
        <Card className="flex items-center gap-3 py-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Layers size={13} />
            <span className="font-rajdhani">Capas</span>
          </div>
          <div className="w-px h-4 bg-surface-300" />
          <button
            onClick={() => toggleLayer('factories')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-rajdhani transition-colors ${
              layers.factories ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-600'
            }`}
          >
            <Factory size={12} />
            Fábricas
          </button>
          <button
            onClick={() => toggleLayer('players')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-rajdhani transition-colors ${
              layers.players ? 'bg-accent/20 text-accent border border-accent/30' : 'text-gray-600'
            }`}
          >
            <Users size={12} />
            Jugadores
          </button>
          <button
            onClick={() => toggleLayer('trains')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-rajdhani transition-colors ${
              layers.trains ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'text-gray-600'
            }`}
          >
            <Train size={12} />
            Trenes
          </button>
        </Card>
      </div>

      {/* Mapa */}
      <div className="flex-1 rounded-lg overflow-hidden border border-surface-300 min-h-96">
        <MapContainer
          center={MAP_CENTER}
          zoom={1}
          minZoom={-2}
          maxZoom={4}
          crs={L.CRS.Simple}
          style={{ height: '100%', width: '100%', background: '#0F0F0F' }}
          zoomControl={true}
        >
          <MapController />

          {/* Imagen base del mapa */}
          <ImageOverlay
            url={MAP_IMAGE_URL}
            bounds={LEAFLET_BOUNDS}
            opacity={0.9}
          />

          {/* Marcadores de jugadores */}
          {layers.players && players.map((player) => (
            <Marker
              key={player.ID}
              position={gameToLatLng(player.location.x, player.location.y)}
              icon={playerIcon}
            >
              <Popup className="ficsit-popup">
                <div className="bg-surface-100 border border-surface-300 rounded p-3 min-w-48">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-rajdhani font-bold text-gray-100">{player.Name}</span>
                    <Badge variant={player.Online ? 'ok' : 'default'}>
                      {player.Online ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mb-2">
                    X:{player.location.x.toFixed(0)} Y:{player.location.y.toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-400">
                    ❤️ {player.PlayerHP}/100
                  </p>
                  {player.Inventory && player.Inventory.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-surface-300">
                      <p className="text-xs text-gray-500 mb-1">Inventario:</p>
                      {player.Inventory.slice(0, 4).map((item) => (
                        <p key={item.ClassName} className="text-xs text-gray-300">
                          {item.Name}: <span className="font-mono">{item.Amount}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Marcadores de fábricas */}
          {layers.factories && machines.map((machine) => (
            <Marker
              key={machine.ID}
              position={gameToLatLng(machine.location.x, machine.location.y)}
              icon={factoryIcon}
            >
              <Popup>
                <div className="bg-surface-100 border border-surface-300 rounded p-3 min-w-48">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-rajdhani font-bold text-gray-100">{machine.Name}</span>
                    <Badge variant={machine.IsProducing ? 'ok' : machine.IsPaused ? 'error' : 'warn'}>
                      {machine.IsProducing ? 'OK' : machine.IsPaused ? 'Parada' : 'Baja'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">
                    📦 {machine.Recipe}
                  </p>
                  <p className="text-xs text-gray-400">
                    ⚡ {machine.Productivity.toFixed(0)}% eficiencia
                  </p>
                  <p className="text-xs font-mono text-gray-600 mt-1">
                    X:{machine.location.x.toFixed(0)} Y:{machine.location.y.toFixed(0)}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Marcadores de trenes */}
          {layers.trains && trains.map((train) => (
            <Marker
              key={train.TrainName}
              position={gameToLatLng(train.location.x, train.location.y)}
              icon={trainIcon}
            >
              <Popup>
                <div className="bg-surface-100 border border-surface-300 rounded p-3 min-w-48">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-rajdhani font-bold text-gray-100">{train.TrainName}</span>
                    <Badge variant={train.Derailed ? 'error' : 'ok'}>
                      {train.Derailed ? 'Descarrilado' : 'En ruta'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">
                    📍 {train.TrainStation || 'En movimiento'}
                  </p>
                  {train.TimeTable && (
                    <p className="text-xs text-gray-500">
                      Ruta: {train.TimeTable.map(s => s.StationName).join(' → ')}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}