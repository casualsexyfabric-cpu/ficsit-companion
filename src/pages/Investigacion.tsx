import { useState } from 'react'
import { BookOpen, CheckCircle, Clock, Lock } from 'lucide-react'
import { Card, Badge, ProgressBar } from '@/components/ui'

interface Milestone {
  id: string
  name: string
  tier: number
  materials: { name: string; required: number }[]
  unlocks: string[]
  status: 'pending' | 'inprogress' | 'ready'
}

interface Research {
  id: string
  name: string
  materials: { name: string; required: number }[]
  unlocks: string
  status: 'pending' | 'inprogress' | 'ready'
}

const mockMilestones: Milestone[] = [
  {
    id: 'm1', name: 'Logística básica', tier: 1,
    materials: [
      { name: 'Iron Plate', required: 10 },
      { name: 'Iron Rod', required: 10 },
    ],
    unlocks: ['Constructor', 'Cinta transportadora Mk.1'],
    status: 'ready',
  },
  {
    id: 'm2', name: 'Logística de campo', tier: 1,
    materials: [
      { name: 'Iron Plate', required: 15 },
      { name: 'Iron Rod', required: 15 },
      { name: 'Wire', required: 10 },
    ],
    unlocks: ['Almacén industrial', 'Extractor portátil'],
    status: 'inprogress',
  },
  {
    id: 'm3', name: 'Piezas de acero', tier: 3,
    materials: [
      { name: 'Steel Beam', required: 50 },
      { name: 'Steel Pipe', required: 30 },
    ],
    unlocks: ['Ensambladora', 'Cinta transportadora Mk.3'],
    status: 'pending',
  },
]

const mockResearch: Research[] = [
  {
    id: 'r1', name: 'Investigación de cátaros',
    materials: [{ name: 'Caterium Ore', required: 10 }],
    unlocks: 'Cables de cátaros',
    status: 'ready',
  },
  {
    id: 'r2', name: 'Investigación de cuarzo',
    materials: [{ name: 'Raw Quartz', required: 10 }],
    unlocks: 'Cristal de cuarzo',
    status: 'inprogress',
  },
  {
    id: 'r3', name: 'Investigación de sulfuro',
    materials: [{ name: 'Sulfur', required: 10 }],
    unlocks: 'Explosivos de nitrato',
    status: 'pending',
  },
]

function StatusBadge({ status }: { status: Milestone['status'] }) {
  if (status === 'ready') return <Badge variant="ok">Listo para entregar</Badge>
  if (status === 'inprogress') return <Badge variant="warn">En progreso</Badge>
  return <Badge variant="default">Pendiente</Badge>
}

function StatusIcon({ status }: { status: Milestone['status'] }) {
  if (status === 'ready') return <CheckCircle size={16} className="text-status-ok" />
  if (status === 'inprogress') return <Clock size={16} className="text-status-warn" />
  return <Lock size={16} className="text-gray-600" />
}

export function Investigacion() {
  const [tab, setTab] = useState<'milestones' | 'mam'>('milestones')

  const readyMilestones = mockMilestones.filter((m) => m.status === 'ready')
  const readyResearch = mockResearch.filter((r) => r.status === 'ready')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
          Tracker de Investigación
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Milestones del HUB y researches del MAM
        </p>
      </div>

      {/* Alertas de listos para entregar */}
      {(readyMilestones.length > 0 || readyResearch.length > 0) && (
        <div className="flex flex-col gap-2">
          {readyMilestones.map((m) => (
            <div key={m.id} className="flex items-center gap-3 bg-status-ok/10 border border-status-ok/30 rounded-lg px-4 py-3">
              <CheckCircle size={16} className="text-status-ok shrink-0" />
              <p className="font-rajdhani font-semibold text-status-ok">
                Milestone listo: <span className="text-white">{m.name}</span> — ¡Tier {m.tier} listo para entregar!
              </p>
            </div>
          ))}
          {readyResearch.map((r) => (
            <div key={r.id} className="flex items-center gap-3 bg-status-ok/10 border border-status-ok/30 rounded-lg px-4 py-3">
              <CheckCircle size={16} className="text-status-ok shrink-0" />
              <p className="font-rajdhani font-semibold text-status-ok">
                Research listo: <span className="text-white">{r.name}</span> — ¡Listo para investigar!
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('milestones')}
          className={`px-4 py-2 rounded font-rajdhani font-semibold text-sm transition-colors ${
            tab === 'milestones' ? 'bg-accent text-white' : 'text-gray-400 hover:text-gray-100 hover:bg-surface-200'
          }`}
        >
          Milestones HUB
        </button>
        <button
          onClick={() => setTab('mam')}
          className={`px-4 py-2 rounded font-rajdhani font-semibold text-sm transition-colors ${
            tab === 'mam' ? 'bg-accent text-white' : 'text-gray-400 hover:text-gray-100 hover:bg-surface-200'
          }`}
        >
          MAM
        </button>
      </div>

      {/* Milestones */}
      {tab === 'milestones' && (
        <div className="flex flex-col gap-3">
          {mockMilestones.map((milestone) => (
            <Card key={milestone.id}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <StatusIcon status={milestone.status} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-rajdhani font-bold text-gray-100">
                        {milestone.name}
                      </span>
                      <Badge variant="accent">Tier {milestone.tier}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Desbloquea: {milestone.unlocks.join(', ')}
                    </p>
                  </div>
                </div>
                <StatusBadge status={milestone.status} />
              </div>

              <div className="flex flex-col gap-2">
                {milestone.materials.map((mat) => (
                  <div key={mat.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{mat.name}</span>
                    <div className="flex items-center gap-3 w-48">
                      <ProgressBar
                        value={milestone.status === 'ready' ? mat.required : milestone.status === 'inprogress' ? mat.required * 0.6 : 0}
                        max={mat.required}
                        className="flex-1"
                      />
                      <span className="font-mono text-xs text-gray-500 w-16 text-right">
                        {milestone.status === 'ready' ? mat.required : milestone.status === 'inprogress' ? Math.floor(mat.required * 0.6) : 0}/{mat.required}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MAM */}
      {tab === 'mam' && (
        <div className="flex flex-col gap-3">
          {mockResearch.map((research) => (
            <Card key={research.id}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <StatusIcon status={research.status} />
                  <div>
                    <span className="font-rajdhani font-bold text-gray-100">
                      {research.name}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Desbloquea: {research.unlocks}
                    </p>
                  </div>
                </div>
                <StatusBadge status={research.status} />
              </div>

              <div className="flex flex-col gap-2">
                {research.materials.map((mat) => (
                  <div key={mat.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{mat.name}</span>
                    <div className="flex items-center gap-3 w-48">
                      <ProgressBar
                        value={research.status === 'ready' ? mat.required : research.status === 'inprogress' ? mat.required * 0.5 : 0}
                        max={mat.required}
                        className="flex-1"
                      />
                      <span className="font-mono text-xs text-gray-500 w-16 text-right">
                        {research.status === 'ready' ? mat.required : research.status === 'inprogress' ? Math.floor(mat.required * 0.5) : 0}/{mat.required}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}