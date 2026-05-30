export interface Recipe {
  id: string
  name: string
  machine: string
  powerMW: number
  timeSeconds: number
  inputs: { item: string; amount: number }[]
  outputs: { item: string; amount: number }[]
  isAlternate: boolean
}

export interface Item {
  id: string
  name: string
  nameEs: string
  isRaw: boolean
}

// Extractores por nivel y pureza del nodo (items/min)
export const EXTRACTOR_RATES = {
  miner: {
    mk1: { impure: 30, normal: 60, pure: 120 },
    mk2: { impure: 60, normal: 120, pure: 240 },
    mk3: { impure: 120, normal: 240, pure: 480 },
  },
  oil_extractor: {
    mk1: { impure: 30, normal: 60, pure: 120 },
  },
  water_extractor: {
    mk1: { impure: 120, normal: 120, pure: 120 },
  },
} as const

export type NodePurity = 'impure' | 'normal' | 'pure'
export type MinerLevel = 'mk1' | 'mk2' | 'mk3'

export interface NodeConfig {
  impure: number
  normal: number
  pure: number
  minerLevel: MinerLevel
}

export function calcMaxExtraction(config: NodeConfig, isOil = false): number {
  const rates = isOil
    ? EXTRACTOR_RATES.oil_extractor.mk1
    : EXTRACTOR_RATES.miner[config.minerLevel]
  return (
    config.impure * rates.impure +
    config.normal * rates.normal +
    config.pure * rates.pure
  )
}

export const ITEMS: Record<string, Item> = {
  // Raw
  iron_ore: { id: 'iron_ore', name: 'Iron Ore', nameEs: 'Mineral de Hierro', isRaw: true },
  copper_ore: { id: 'copper_ore', name: 'Copper Ore', nameEs: 'Mineral de Cobre', isRaw: true },
  limestone: { id: 'limestone', name: 'Limestone', nameEs: 'Piedra Caliza', isRaw: true },
  coal: { id: 'coal', name: 'Coal', nameEs: 'Carbón', isRaw: true },
  caterium_ore: { id: 'caterium_ore', name: 'Caterium Ore', nameEs: 'Mineral de Caterio', isRaw: true },
  raw_quartz: { id: 'raw_quartz', name: 'Raw Quartz', nameEs: 'Cuarzo en Bruto', isRaw: true },
  sulfur: { id: 'sulfur', name: 'Sulfur', nameEs: 'Azufre', isRaw: true },
  bauxite: { id: 'bauxite', name: 'Bauxite', nameEs: 'Bauxita', isRaw: true },
  crude_oil: { id: 'crude_oil', name: 'Crude Oil', nameEs: 'Petróleo Crudo', isRaw: true },
  nitrogen_gas: { id: 'nitrogen_gas', name: 'Nitrogen Gas', nameEs: 'Gas Nitrógeno', isRaw: true },
  water: { id: 'water', name: 'Water', nameEs: 'Agua', isRaw: true },

  // Procesados
  iron_ingot: { id: 'iron_ingot', name: 'Iron Ingot', nameEs: 'Lingote de Hierro', isRaw: false },
  iron_plate: { id: 'iron_plate', name: 'Iron Plate', nameEs: 'Placa de Hierro', isRaw: false },
  iron_rod: { id: 'iron_rod', name: 'Iron Rod', nameEs: 'Varilla de Hierro', isRaw: false },
  screw: { id: 'screw', name: 'Screw', nameEs: 'Tornillo', isRaw: false },
  reinforced_iron_plate: { id: 'reinforced_iron_plate', name: 'Reinforced Iron Plate', nameEs: 'Placa de Hierro Reforzada', isRaw: false },
  copper_ingot: { id: 'copper_ingot', name: 'Copper Ingot', nameEs: 'Lingote de Cobre', isRaw: false },
  wire: { id: 'wire', name: 'Wire', nameEs: 'Cable Fino', isRaw: false },
  cable: { id: 'cable', name: 'Cable', nameEs: 'Cable', isRaw: false },
  concrete: { id: 'concrete', name: 'Concrete', nameEs: 'Hormigón', isRaw: false },
  quartz_crystal: { id: 'quartz_crystal', name: 'Quartz Crystal', nameEs: 'Cristal de Cuarzo', isRaw: false },
  silica: { id: 'silica', name: 'Silica', nameEs: 'Sílice', isRaw: false },
  steel_ingot: { id: 'steel_ingot', name: 'Steel Ingot', nameEs: 'Lingote de Acero', isRaw: false },
  steel_beam: { id: 'steel_beam', name: 'Steel Beam', nameEs: 'Viga de Acero', isRaw: false },
  steel_pipe: { id: 'steel_pipe', name: 'Steel Pipe', nameEs: 'Tubo de Acero', isRaw: false },
  versatile_framework: { id: 'versatile_framework', name: 'Versatile Framework', nameEs: 'Armazón Versátil', isRaw: false },
  rotor: { id: 'rotor', name: 'Rotor', nameEs: 'Rotor', isRaw: false },
  stator: { id: 'stator', name: 'Stator', nameEs: 'Estátor', isRaw: false },
  motor: { id: 'motor', name: 'Motor', nameEs: 'Motor', isRaw: false },
  modular_frame: { id: 'modular_frame', name: 'Modular Frame', nameEs: 'Armazón Modular', isRaw: false },
  encased_industrial_beam: { id: 'encased_industrial_beam', name: 'Encased Industrial Beam', nameEs: 'Viga Industrial Encapsulada', isRaw: false },
  heavy_modular_frame: { id: 'heavy_modular_frame', name: 'Heavy Modular Frame', nameEs: 'Armazón Modular Pesado', isRaw: false },
  circuit_board: { id: 'circuit_board', name: 'Circuit Board', nameEs: 'Placa de Circuito', isRaw: false },
  computer: { id: 'computer', name: 'Computer', nameEs: 'Ordenador', isRaw: false },
  rubber: { id: 'rubber', name: 'Rubber', nameEs: 'Caucho', isRaw: false },
  plastic: { id: 'plastic', name: 'Plastic', nameEs: 'Plástico', isRaw: false },
  fuel: { id: 'fuel', name: 'Fuel', nameEs: 'Combustible', isRaw: false },
  copper_sheet: { id: 'copper_sheet', name: 'Copper Sheet', nameEs: 'Lámina de Cobre', isRaw: false },
  caterium_ingot: { id: 'caterium_ingot', name: 'Caterium Ingot', nameEs: 'Lingote de Caterio', isRaw: false },
  quickwire: { id: 'quickwire', name: 'Quickwire', nameEs: 'Cable Rápido', isRaw: false },
  ai_limiter: { id: 'ai_limiter', name: 'AI Limiter', nameEs: 'Limitador IA', isRaw: false },
}

export const RECIPES: Recipe[] = [
  // Fundidora
  { id: 'iron_ingot', name: 'Lingote de Hierro', machine: 'Fundidora', powerMW: 4, timeSeconds: 2, inputs: [{ item: 'iron_ore', amount: 1 }], outputs: [{ item: 'iron_ingot', amount: 1 }], isAlternate: false },
  { id: 'copper_ingot', name: 'Lingote de Cobre', machine: 'Fundidora', powerMW: 4, timeSeconds: 2, inputs: [{ item: 'copper_ore', amount: 1 }], outputs: [{ item: 'copper_ingot', amount: 1 }], isAlternate: false },
  { id: 'caterium_ingot', name: 'Lingote de Caterio', machine: 'Fundidora', powerMW: 4, timeSeconds: 4, inputs: [{ item: 'caterium_ore', amount: 3 }], outputs: [{ item: 'caterium_ingot', amount: 1 }], isAlternate: false },

  // Fundición
  { id: 'steel_ingot', name: 'Lingote de Acero', machine: 'Fundición', powerMW: 16, timeSeconds: 4, inputs: [{ item: 'iron_ore', amount: 3 }, { item: 'coal', amount: 3 }], outputs: [{ item: 'steel_ingot', amount: 3 }], isAlternate: false },

  // Constructor
  { id: 'iron_plate', name: 'Placa de Hierro', machine: 'Constructor', powerMW: 4, timeSeconds: 6, inputs: [{ item: 'iron_ingot', amount: 3 }], outputs: [{ item: 'iron_plate', amount: 2 }], isAlternate: false },
  { id: 'iron_rod', name: 'Varilla de Hierro', machine: 'Constructor', powerMW: 4, timeSeconds: 4, inputs: [{ item: 'iron_ingot', amount: 1 }], outputs: [{ item: 'iron_rod', amount: 1 }], isAlternate: false },
  { id: 'screw', name: 'Tornillo', machine: 'Constructor', powerMW: 2, timeSeconds: 6, inputs: [{ item: 'iron_rod', amount: 1 }], outputs: [{ item: 'screw', amount: 4 }], isAlternate: false },
  { id: 'wire', name: 'Cable Fino', machine: 'Constructor', powerMW: 4, timeSeconds: 4, inputs: [{ item: 'copper_ingot', amount: 1 }], outputs: [{ item: 'wire', amount: 2 }], isAlternate: false },
  { id: 'concrete', name: 'Hormigón', machine: 'Constructor', powerMW: 4, timeSeconds: 4, inputs: [{ item: 'limestone', amount: 3 }], outputs: [{ item: 'concrete', amount: 1 }], isAlternate: false },
  { id: 'quartz_crystal', name: 'Cristal de Cuarzo', machine: 'Constructor', powerMW: 8, timeSeconds: 8, inputs: [{ item: 'raw_quartz', amount: 5 }], outputs: [{ item: 'quartz_crystal', amount: 3 }], isAlternate: false },
  { id: 'silica', name: 'Sílice', machine: 'Constructor', powerMW: 8, timeSeconds: 8, inputs: [{ item: 'raw_quartz', amount: 3 }], outputs: [{ item: 'silica', amount: 5 }], isAlternate: false },
  { id: 'steel_beam', name: 'Viga de Acero', machine: 'Constructor', powerMW: 4, timeSeconds: 4, inputs: [{ item: 'steel_ingot', amount: 4 }], outputs: [{ item: 'steel_beam', amount: 1 }], isAlternate: false },
  { id: 'steel_pipe', name: 'Tubo de Acero', machine: 'Constructor', powerMW: 4, timeSeconds: 6, inputs: [{ item: 'steel_ingot', amount: 3 }], outputs: [{ item: 'steel_pipe', amount: 2 }], isAlternate: false },
  { id: 'copper_sheet', name: 'Lámina de Cobre', machine: 'Constructor', powerMW: 4, timeSeconds: 6, inputs: [{ item: 'copper_ingot', amount: 2 }], outputs: [{ item: 'copper_sheet', amount: 1 }], isAlternate: false },
  { id: 'quickwire', name: 'Cable Rápido', machine: 'Constructor', powerMW: 4, timeSeconds: 5, inputs: [{ item: 'caterium_ingot', amount: 1 }], outputs: [{ item: 'quickwire', amount: 5 }], isAlternate: false },

  // Ensambladora
  { id: 'reinforced_iron_plate', name: 'Placa de Hierro Reforzada', machine: 'Ensambladora', powerMW: 15, timeSeconds: 12, inputs: [{ item: 'iron_plate', amount: 6 }, { item: 'screw', amount: 12 }], outputs: [{ item: 'reinforced_iron_plate', amount: 1 }], isAlternate: false },
  { id: 'cable', name: 'Cable', machine: 'Ensambladora', powerMW: 15, timeSeconds: 12, inputs: [{ item: 'wire', amount: 2 }], outputs: [{ item: 'cable', amount: 1 }], isAlternate: false },
  { id: 'rotor', name: 'Rotor', machine: 'Ensambladora', powerMW: 15, timeSeconds: 15, inputs: [{ item: 'iron_rod', amount: 5 }, { item: 'screw', amount: 25 }], outputs: [{ item: 'rotor', amount: 1 }], isAlternate: false },
  { id: 'stator', name: 'Estátor', machine: 'Ensambladora', powerMW: 15, timeSeconds: 12, inputs: [{ item: 'steel_pipe', amount: 3 }, { item: 'wire', amount: 8 }], outputs: [{ item: 'stator', amount: 1 }], isAlternate: false },
  { id: 'modular_frame', name: 'Armazón Modular', machine: 'Ensambladora', powerMW: 15, timeSeconds: 60, inputs: [{ item: 'reinforced_iron_plate', amount: 3 }, { item: 'iron_rod', amount: 12 }], outputs: [{ item: 'modular_frame', amount: 2 }], isAlternate: false },
  { id: 'versatile_framework', name: 'Armazón Versátil', machine: 'Ensambladora', powerMW: 15, timeSeconds: 24, inputs: [{ item: 'modular_frame', amount: 1 }, { item: 'steel_beam', amount: 12 }], outputs: [{ item: 'versatile_framework', amount: 2 }], isAlternate: false },
  { id: 'encased_industrial_beam', name: 'Viga Industrial Encapsulada', machine: 'Ensambladora', powerMW: 15, timeSeconds: 10, inputs: [{ item: 'steel_beam', amount: 4 }, { item: 'concrete', amount: 5 }], outputs: [{ item: 'encased_industrial_beam', amount: 1 }], isAlternate: false },
  { id: 'circuit_board', name: 'Placa de Circuito', machine: 'Ensambladora', powerMW: 15, timeSeconds: 8, inputs: [{ item: 'copper_sheet', amount: 2 }, { item: 'plastic', amount: 4 }], outputs: [{ item: 'circuit_board', amount: 1 }], isAlternate: false },
  { id: 'ai_limiter', name: 'Limitador IA', machine: 'Ensambladora', powerMW: 15, timeSeconds: 12, inputs: [{ item: 'copper_sheet', amount: 5 }, { item: 'quickwire', amount: 20 }], outputs: [{ item: 'ai_limiter', amount: 1 }], isAlternate: false },

  // Fabricadora
  { id: 'motor', name: 'Motor', machine: 'Fabricadora', powerMW: 55, timeSeconds: 12, inputs: [{ item: 'rotor', amount: 2 }, { item: 'stator', amount: 2 }], outputs: [{ item: 'motor', amount: 1 }], isAlternate: false },
  { id: 'heavy_modular_frame', name: 'Armazón Modular Pesado', machine: 'Fabricadora', powerMW: 55, timeSeconds: 30, inputs: [{ item: 'modular_frame', amount: 5 }, { item: 'steel_pipe', amount: 15 }, { item: 'encased_industrial_beam', amount: 5 }, { item: 'screw', amount: 100 }], outputs: [{ item: 'heavy_modular_frame', amount: 1 }], isAlternate: false },
  { id: 'computer', name: 'Ordenador', machine: 'Fabricadora', powerMW: 55, timeSeconds: 24, inputs: [{ item: 'circuit_board', amount: 10 }, { item: 'cable', amount: 9 }, { item: 'plastic', amount: 18 }, { item: 'screw', amount: 52 }], outputs: [{ item: 'computer', amount: 1 }], isAlternate: false },

  // Alternativas
  { id: 'cable_quickwire', name: 'Cable (Alt. Cable Rápido)', machine: 'Ensambladora', powerMW: 15, timeSeconds: 24, inputs: [{ item: 'quickwire', amount: 3 }, { item: 'rubber', amount: 2 }], outputs: [{ item: 'cable', amount: 11 }], isAlternate: true },
  { id: 'iron_wire', name: 'Cable Fino de Hierro', machine: 'Constructor', powerMW: 4, timeSeconds: 24, inputs: [{ item: 'iron_ingot', amount: 5 }], outputs: [{ item: 'wire', amount: 9 }], isAlternate: true },
  { id: 'steel_screw', name: 'Tornillo de Acero', machine: 'Constructor', powerMW: 4, timeSeconds: 12, inputs: [{ item: 'steel_beam', amount: 1 }], outputs: [{ item: 'screw', amount: 52 }], isAlternate: true },
]

export function getRecipesForItem(itemId: string): Recipe[] {
  return RECIPES.filter(r => r.outputs.some(o => o.item === itemId))
}

export function getItemById(itemId: string): Item | undefined {
  return ITEMS[itemId]
}

// Qué recurso raw necesita cada item producible
export const ITEM_RAW_DEPENDENCY: Record<string, string> = {
  iron_ingot: 'iron_ore',
  iron_plate: 'iron_ore',
  iron_rod: 'iron_ore',
  screw: 'iron_ore',
  reinforced_iron_plate: 'iron_ore',
  modular_frame: 'iron_ore',
  rotor: 'iron_ore',
  motor: 'iron_ore',
  heavy_modular_frame: 'iron_ore',
  steel_ingot: 'iron_ore',
  steel_beam: 'iron_ore',
  steel_pipe: 'iron_ore',
  versatile_framework: 'iron_ore',
  encased_industrial_beam: 'iron_ore',
  copper_ingot: 'copper_ore',
  wire: 'copper_ore',
  cable: 'copper_ore',
  copper_sheet: 'copper_ore',
  stator: 'copper_ore',
  circuit_board: 'copper_ore',
  computer: 'copper_ore',
  concrete: 'limestone',
  quartz_crystal: 'raw_quartz',
  silica: 'raw_quartz',
  caterium_ingot: 'caterium_ore',
  quickwire: 'caterium_ore',
  ai_limiter: 'caterium_ore',
}