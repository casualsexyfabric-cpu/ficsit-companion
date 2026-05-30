import { RECIPES, getRecipesForItem, type Recipe } from './recipes'

export interface ProductionStep {
  itemId: string
  itemName: string
  amountPerMin: number
  recipe: Recipe
  machineCount: number
  machineCountCeil: number
  powerMW: number
  depth: number
}

export interface CalculationResult {
  steps: ProductionStep[]
  rawResources: Record<string, { name: string; amountPerMin: number }>
  totalPowerMW: number
}

export function calculateProduction(
  itemId: string,
  amountPerMin: number,
  selectedRecipes: Record<string, string>,
  depth = 0,
  visited = new Set<string>()
): CalculationResult {
  const steps: ProductionStep[] = []
  const rawResources: Record<string, { name: string; amountPerMin: number }> = {}

  if (visited.has(itemId)) {
    return { steps, rawResources, totalPowerMW: 0 }
  }
  visited.add(itemId)

  const availableRecipes = getRecipesForItem(itemId)
  if (availableRecipes.length === 0) {
    // Es recurso raw
    rawResources[itemId] = {
      name: itemId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      amountPerMin,
    }
    return { steps, rawResources, totalPowerMW: 0 }
  }

  // Seleccionar receta
  const selectedRecipeId = selectedRecipes[itemId]
  const recipe = selectedRecipeId
    ? availableRecipes.find(r => r.id === selectedRecipeId) ?? availableRecipes[0]
    : availableRecipes[0]

  // Calcular output por minuto de la receta
  const primaryOutput = recipe.outputs.find(o => o.item === itemId)
  if (!primaryOutput) return { steps, rawResources, totalPowerMW: 0 }

  const outputPerMin = (primaryOutput.amount / recipe.timeSeconds) * 60
  const machineCount = amountPerMin / outputPerMin
  const machineCountCeil = Math.ceil(machineCount)
  const powerMW = machineCount * recipe.powerMW

  steps.push({
    itemId,
    itemName: primaryOutput.item.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    amountPerMin,
    recipe,
    machineCount,
    machineCountCeil,
    powerMW,
    depth,
  })

  let totalPowerMW = powerMW

  // Calcular ingredientes recursivamente
  for (const input of recipe.inputs) {
    const inputPerMin = (input.amount / recipe.timeSeconds) * 60 * machineCount

    const subResult = calculateProduction(
      input.item,
      inputPerMin,
      selectedRecipes,
      depth + 1,
      new Set(visited)
    )

    // Merge steps
    for (const subStep of subResult.steps) {
      const existing = steps.find(s => s.itemId === subStep.itemId && s.recipe.id === subStep.recipe.id)
      if (existing) {
        existing.amountPerMin += subStep.amountPerMin
        existing.machineCount += subStep.machineCount
        existing.machineCountCeil = Math.ceil(existing.machineCount)
        existing.powerMW += subStep.powerMW
      } else {
        steps.push(subStep)
      }
    }

    // Merge raw resources
    for (const [id, resource] of Object.entries(subResult.rawResources)) {
      if (rawResources[id]) {
        rawResources[id].amountPerMin += resource.amountPerMin
      } else {
        rawResources[id] = { ...resource }
      }
    }

    totalPowerMW += subResult.totalPowerMW
  }

  return { steps, rawResources, totalPowerMW }
}