import { useState, useMemo, useEffect } from 'react'
import { Calculator, ChevronDown, Zap, Package, Factory, Pickaxe, AlertTriangle } from 'lucide-react'
import { Card, Button, StatBlock, Badge } from '@/components/ui'
import { ITEMS, getRecipesForItem, calcMaxExtraction, type NodeConfig, type MinerLevel } from '@/lib/recipes'
import { calculateProduction, type CalculationResult } from '@/lib/calculator'

const PRODUCIBLE_ITEMS = Object.values(ITEMS)
  .filter((item) => !item.isRaw)
  .sort((a, b) => a.nameEs.localeCompare(b.nameEs))

const MACHINE_COLORS: Record<string, string> = {
  Fundidora: 'text-orange-400',
  Fundición: 'text-yellow-400',
  Constructor: 'text-blue-400',
  Ensambladora: 'text-green-400',
  Fabricadora: 'text-purple-400',
}

const DEFAULT_NODE_CONFIG: NodeConfig = {
  impure: 0,
  normal: 1,
  pure: 0,
  minerLevel: 'mk1',
}

function NodeCalculatorRow({
  rawId,
  config,
  onChange,
  neededPerMin,
}: {
  rawId: string
  config: NodeConfig
  onChange: (config: NodeConfig) => void
  neededPerMin: number
}) {
  const item = ITEMS[rawId]
  const isOil = rawId === 'crude_oil'
  const isWater = rawId === 'water'
  const maxExtraction = calcMaxExtraction(config, isOil)
  const ratio = neededPerMin > 0 ? (maxExtraction / neededPerMin) * 100 : 100
  const isBottleneck = ratio < 100

  const rateFor = (purity: 'impure' | 'normal' | 'pure') => {
    if (isOil) return purity === 'impure' ? 30 : purity === 'normal' ? 60 : 120
    if (isWater) return 120
    return config.minerLevel === 'mk1'
      ? purity === 'impure' ? 30 : purity === 'normal' ? 60 : 120
      : config.minerLevel === 'mk2'
      ? purity === 'impure' ? 60 : purity === 'normal' ? 120 : 240
      : purity === 'impure' ? 120 : purity === 'normal' ? 240 : 480
  }

  return (
    <div className={`p-4 rounded-lg border ${isBottleneck ? 'border-status-error/40 bg-status-error/5' : 'border-surface-300 bg-surface-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isBottleneck && <AlertTriangle size={13} className="text-status-error" />}
          <span className="font-rajdhani font-semibold text-gray-100">{item?.nameEs ?? rawId}</span>
        </div>
        <div className="text-right">
          <span className={`font-mono text-sm ${isBottleneck ? 'text-status-error' : 'text-status-ok'}`}>
            {maxExtraction.toFixed(0)}/{neededPerMin.toFixed(0)}
          </span>
          <span className="text-xs text-gray-500 ml-1">/min</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        {(['impure', 'normal', 'pure'] as const).map((purity) => (
          <div key={purity} className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">
              {purity === 'impure' ? 'Impuro' : purity === 'normal' ? 'Normal' : 'Puro'}
              <span className="text-gray-600 ml-1">({rateFor(purity)}/min)</span>
            </label>
            <input
              type="number"
              min={0}
              value={config[purity]}
              onChange={(e) => onChange({ ...config, [purity]: Number(e.target.value) })}
              className="w-full bg-surface-300 border border-surface-400 rounded px-2 py-1 text-sm font-mono text-gray-100 focus:outline-none focus:border-accent"
            />
          </div>
        ))}
      </div>

      {!isOil && !isWater && (
        <select
          value={config.minerLevel}
          onChange={(e) => onChange({ ...config, minerLevel: e.target.value as MinerLevel })}
          className="w-full bg-surface-300 border border-surface-400 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-accent"
        >
          <option value="mk1">Minero Mk.1</option>
          <option value="mk2">Minero Mk.2</option>
          <option value="mk3">Minero Mk.3</option>
        </select>
      )}

      <div className="mt-2 h-1.5 bg-surface-400 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isBottleneck ? 'bg-status-error' : 'bg-status-ok'}`}
          style={{ width: `${Math.min(ratio, 100)}%` }}
        />
      </div>
    </div>
  )
}

export function Calculadora() {
  const [selectedItem, setSelectedItem] = useState('')
  const [amountPerMin, setAmountPerMin] = useState(10)
  const [selectedRecipes, setSelectedRecipes] = useState<Record<string, string>>({})
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [calculated, setCalculated] = useState(false)
  const [nodeConfigs, setNodeConfigs] = useState<Record<string, NodeConfig>>({})

  const preview = useMemo(() => {
    if (!selectedItem) return null
    return calculateProduction(selectedItem, 1, selectedRecipes)
  }, [selectedItem, selectedRecipes])

  const maxFromNodes = useMemo(() => {
    if (!preview || Object.keys(nodeConfigs).length === 0) return null
    let minRatio = Infinity
    Object.entries(preview.rawResources).forEach(([rawId, resource]) => {
      const config = nodeConfigs[rawId]
      if (!config || resource.amountPerMin <= 0) return
      const maxExtraction = calcMaxExtraction(config, rawId === 'crude_oil')
      const ratio = maxExtraction / resource.amountPerMin
      minRatio = Math.min(minRatio, ratio)
    })
    return minRatio === Infinity ? null : minRatio
  }, [nodeConfigs, preview])

  // Actualizar cantidad objetivo automáticamente cuando cambian los nodos
  useEffect(() => {
    if (maxFromNodes !== null && maxFromNodes > 0) {
      setAmountPerMin(Math.floor(maxFromNodes))
    }
  }, [maxFromNodes])

  function handleSelectItem(itemId: string) {
    setSelectedItem(itemId)
    setSelectedRecipes({})
    setResult(null)
    setCalculated(false)

    if (itemId) {
      const prev = calculateProduction(itemId, 1, {})
      const configs: Record<string, NodeConfig> = {}
      Object.keys(prev.rawResources).forEach((id) => {
        configs[id] = { ...DEFAULT_NODE_CONFIG }
      })
      setNodeConfigs(configs)
    } else {
      setNodeConfigs({})
    }
  }

  function handleCalculate(amount?: number) {
    if (!selectedItem) return
    const qty = amount ?? amountPerMin
    const res = calculateProduction(selectedItem, qty, selectedRecipes)
    setResult(res)
    setCalculated(true)
    if (amount) setAmountPerMin(amount)
  }

  function handleRecipeChange(itemId: string, recipeId: string) {
    const newRecipes = { ...selectedRecipes, [itemId]: recipeId }
    setSelectedRecipes(newRecipes)
    if (calculated && selectedItem) {
      const res = calculateProduction(selectedItem, amountPerMin, newRecipes)
      setResult(res)
    }
  }

  function handleNodeConfigChange(rawId: string, config: NodeConfig) {
    setNodeConfigs((prev) => ({ ...prev, [rawId]: config }))
  }

  const stepsByDepth = useMemo(() => {
    if (!result) return []
    return [...result.steps].sort((a, b) => a.depth - b.depth)
  }, [result])

  const hasNodes = Object.keys(nodeConfigs).length > 0

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
          Calculadora de Fábricas
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Calcula la cadena de producción completa para cualquier item
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Calculator size={15} className="text-accent" />
          <h2 className="font-rajdhani font-semibold text-gray-100">Configurar producción</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider">
              Item a producir
            </label>
            <div className="relative">
              <select
                value={selectedItem}
                onChange={(e) => handleSelectItem(e.target.value)}
                className="w-full bg-surface-200 border border-surface-400 rounded px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-accent appearance-none"
              >
                <option value="">Seleccionar item...</option>
                {PRODUCIBLE_ITEMS.map((item) => (
                  <option key={item.id} value={item.id}>{item.nameEs}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider">
              Cantidad objetivo
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={10000}
                value={amountPerMin}
                onChange={(e) => setAmountPerMin(Number(e.target.value))}
                className="flex-1 bg-surface-200 border border-surface-400 rounded px-3 py-2 text-sm font-mono text-gray-100 focus:outline-none focus:border-accent"
              />
              <span className="text-sm text-gray-500 shrink-0">/min</span>
            </div>
            {maxFromNodes !== null && (
              <p className="text-xs text-accent">
                Máximo según nodos: {Math.floor(maxFromNodes)}/min
              </p>
            )}
          </div>

          <div className="flex flex-col justify-end">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleCalculate()}
              disabled={!selectedItem || amountPerMin <= 0}
              className="w-full justify-center"
            >
              <Calculator size={16} />
              Calcular
            </Button>
          </div>
        </div>

        {/* Calculadora de nodos */}
        {selectedItem && hasNodes && preview && (
          <div className="mt-5 pt-5 border-t border-surface-300">
            <div className="flex items-center gap-2 mb-3">
              <Pickaxe size={14} className="text-accent" />
              <p className="text-sm font-rajdhani font-semibold text-gray-100">
                Nodos disponibles
              </p>
              <span className="text-xs text-gray-500">— la cantidad objetivo se actualiza automáticamente</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(nodeConfigs).map(([rawId, config]) => {
                const needed = (preview.rawResources[rawId]?.amountPerMin ?? 0) * amountPerMin
                return (
                  <NodeCalculatorRow
                    key={rawId}
                    rawId={rawId}
                    config={config}
                    onChange={(c) => handleNodeConfigChange(rawId, c)}
                    neededPerMin={needed}
                  />
                )
              })}
            </div>
          </div>
        )}
      </Card>

      {/* Resultados */}
      {result && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <StatBlock label="Máquinas totales" value={result.steps.reduce((acc, s) => acc + s.machineCountCeil, 0)} sublabel="en toda la cadena" />
            </Card>
            <Card>
              <StatBlock label="Consumo total" value={result.totalPowerMW.toFixed(1)} unit="MW" sublabel="estimado" />
            </Card>
            <Card>
              <StatBlock label="Pasos de producción" value={result.steps.length} sublabel="recetas distintas" />
            </Card>
            <Card>
              <StatBlock label="Recursos raw" value={Object.keys(result.rawResources).length} sublabel="tipos necesarios" />
            </Card>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-300 flex items-center gap-2">
              <Factory size={15} className="text-accent" />
              <h2 className="font-rajdhani font-semibold text-gray-100">Cadena de producción</h2>
            </div>
            <div className="divide-y divide-surface-300/50">
              {stepsByDepth.map((step) => {
                const availableRecipes = getRecipesForItem(step.itemId)
                const hasAlternates = availableRecipes.length > 1
                const itemData = ITEMS[step.itemId]
                return (
                  <div
                    key={`${step.itemId}-${step.depth}`}
                    className="px-4 py-3 hover:bg-surface-200/30 transition-colors"
                    style={{ paddingLeft: `${16 + step.depth * 20}px` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {step.depth > 0 && <span className="text-gray-600 text-xs">└</span>}
                          <span className="font-rajdhani font-semibold text-gray-100">
                            {itemData?.nameEs ?? step.itemId}
                          </span>
                          <span className={`text-xs font-rajdhani ${MACHINE_COLORS[step.recipe.machine] ?? 'text-gray-400'}`}>
                            {step.recipe.machine}
                          </span>
                          {step.recipe.isAlternate && <Badge variant="accent">Alt</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="font-mono">{step.amountPerMin.toFixed(1)}/min</span>
                          <span>
                            {step.machineCount.toFixed(2)} máquinas
                            <span className="text-gray-600 ml-1">(→ {step.machineCountCeil} reales)</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Zap size={10} className="text-yellow-500" />
                            {step.powerMW.toFixed(1)} MW
                          </span>
                        </div>
                        {hasAlternates && (
                          <div className="mt-2">
                            <select
                              value={selectedRecipes[step.itemId] ?? availableRecipes[0].id}
                              onChange={(e) => handleRecipeChange(step.itemId, e.target.value)}
                              className="bg-surface-300 border border-surface-400 rounded px-2 py-0.5 text-xs text-gray-300 focus:outline-none focus:border-accent"
                            >
                              {availableRecipes.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.isAlternate ? `★ Alt: ${r.name}` : r.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-mono font-bold text-gray-100">{step.machineCountCeil}</div>
                        <div className={`text-xs font-rajdhani ${MACHINE_COLORS[step.recipe.machine] ?? 'text-gray-400'}`}>
                          {step.recipe.machine}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Package size={15} className="text-accent" />
              <h2 className="font-rajdhani font-semibold text-gray-100">Recursos raw necesarios</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(result.rawResources)
                .sort((a, b) => b[1].amountPerMin - a[1].amountPerMin)
                .map(([id, resource]) => (
                  <div key={id} className="bg-surface-200 rounded p-3">
                    <p className="text-xs text-gray-500 mb-1">{ITEMS[id]?.nameEs ?? resource.name}</p>
                    <p className="font-mono text-lg text-gray-100">
                      {resource.amountPerMin.toFixed(1)}
                      <span className="text-xs text-gray-500 ml-1">/min</span>
                    </p>
                  </div>
                ))}
            </div>
          </Card>
        </>
      )}

      {!calculated && !selectedItem && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Calculator size={40} className="text-gray-600" />
          <p className="font-rajdhani text-gray-500 text-lg">
            Selecciona un item para empezar
          </p>
        </div>
      )}
    </div>
  )
}