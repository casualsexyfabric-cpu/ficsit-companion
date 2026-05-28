import { useState } from 'react'
import { Save, Wifi, Clock, User } from 'lucide-react'
import { Card, Button, StatBlock } from '@/components/ui'
import { ConnectionStatusIndicator } from '@/components/ui'
import { useAppStore } from '@/store'
import { checkConnection, setApiBaseUrl } from '@/services/satisfactoryApi'

export function Configuracion() {
  const { settings, setSettings, connectionStatus, setConnectionStatus } = useAppStore()

  const [apiUrl, setApiUrl] = useState(settings.apiUrl)
  const [pollingInterval, setPollingInterval] = useState(settings.pollingInterval / 1000)
  const [playerName, setPlayerName] = useState(settings.playerName)
  const [testing, setTesting] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleTestConnection() {
    setTesting(true)
    setConnectionStatus('connecting')
    setApiBaseUrl(apiUrl)
    const ok = await checkConnection()
    setConnectionStatus(ok ? 'connected' : 'error')
    setTesting(false)
  }

  function handleSave() {
    setSettings({
      apiUrl,
      pollingInterval: pollingInterval * 1000,
      playerName,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
          Configuración
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Ajustes de conexión y preferencias de la app
        </p>
      </div>

      {/* Conexión a la API */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Wifi size={16} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100 text-lg">
            Conexión a Satisfactory
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider">
              URL del túnel (Cloudflare)
            </label>
            <input
              type="url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://tu-tunel.trycloudflare.com"
              className="bg-surface-200 border border-surface-400 rounded px-3 py-2 text-sm font-mono text-gray-100 placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
            />
            <p className="text-xs text-gray-600">
              La URL pública que genera Cloudflare Tunnel apuntando al puerto 7777 de Satisfactory
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={handleTestConnection}
              disabled={!apiUrl || testing}
            >
              <Wifi size={14} />
              {testing ? 'Probando...' : 'Probar conexión'}
            </Button>
            <ConnectionStatusIndicator status={connectionStatus} />
          </div>
        </div>
      </Card>

      {/* Intervalo de polling */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100 text-lg">
            Actualización de datos
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider">
              Intervalo de polling
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={2}
                max={30}
                step={1}
                value={pollingInterval}
                onChange={(e) => setPollingInterval(Number(e.target.value))}
                className="flex-1 accent-[#E8630A]"
              />
              <StatBlock
                label=""
                value={pollingInterval}
                unit="seg"
                className="w-16"
              />
            </div>
            <p className="text-xs text-gray-600">
              Cada cuántos segundos se consulta la API. Recomendado: 5 segundos.
            </p>
          </div>
        </div>
      </Card>

      {/* Nombre de jugador */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <User size={16} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100 text-lg">
            Identidad
          </h2>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider">
            Tu nombre en la partida
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Jugador 1"
            className="bg-surface-200 border border-surface-400 rounded px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </Card>

      {/* Guardar */}
      <Button variant="primary" size="lg" onClick={handleSave} className="self-start">
        <Save size={16} />
        {saved ? '¡Guardado!' : 'Guardar configuración'}
      </Button>
    </div>
  )
}