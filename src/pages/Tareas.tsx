import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckSquare, Clock, Target } from 'lucide-react'
import { Card, Badge, Button } from '@/components/ui'
import { subscribeTasks, createTask, updateTask, deleteTask } from '@/services/tasksService'
import type { Task, TaskStatus, TaskHorizon, TaskAssignee } from '@/types'

const horizonLabels: Record<TaskHorizon, string> = {
  short: 'Corto plazo',
  medium: 'Medio plazo',
  long: 'Largo plazo',
}

const horizonVariants: Record<TaskHorizon, 'ok' | 'warn' | 'info'> = {
  short: 'ok',
  medium: 'warn',
  long: 'info',
}

const assigneeLabels: Record<TaskAssignee, string> = {
  player1: 'Jugador 1',
  player2: 'Jugador 2',
  both: 'Ambos',
}

function TaskCard({ task, onUpdate, onDelete }: {
  task: Task
  onUpdate: (id: string, data: Partial<Task>) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-surface-200 border border-surface-300 rounded-lg p-3 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="font-rajdhani font-semibold text-gray-100 text-sm leading-tight">
          {task.title}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-600 hover:text-status-error transition-colors shrink-0"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-1">
        <Badge variant={horizonVariants[task.horizon]}>
          {horizonLabels[task.horizon]}
        </Badge>
        <Badge variant="default">{assigneeLabels[task.assignee]}</Badge>
      </div>

      <div className="flex gap-1 pt-1">
        {(['pending', 'inprogress', 'completed'] as TaskStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => onUpdate(task.id, { status: s })}
            className={`flex-1 text-xs py-1 rounded font-rajdhani transition-colors ${
              task.status === s
                ? 'bg-accent text-white'
                : 'bg-surface-300 text-gray-500 hover:text-gray-300'
            }`}
          >
            {s === 'pending' ? 'Pendiente' : s === 'inprogress' ? 'En progreso' : 'Hecho'}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={task.isSessionGoal}
          onChange={(e) => onUpdate(task.id, { isSessionGoal: e.target.checked })}
          className="accent-[#E8630A] w-3.5 h-3.5"
        />
        <span className="text-xs text-gray-500">Objetivo de sesión</span>
      </label>
    </div>
  )
}

function NewTaskForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [horizon, setHorizon] = useState<TaskHorizon>('short')
  const [assignee, setAssignee] = useState<TaskAssignee>('both')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!title.trim()) return
    setLoading(true)
    await createTask({ title: title.trim(), description: description.trim() || undefined, horizon, assignee })
    setLoading(false)
    onClose()
  }

  return (
    <Card>
      <h3 className="font-rajdhani font-semibold text-gray-100 mb-3">Nueva tarea</h3>
      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la tarea"
          className="bg-surface-200 border border-surface-400 rounded px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-accent transition-colors"
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción (opcional)"
          rows={2}
          className="bg-surface-200 border border-surface-400 rounded px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-accent transition-colors resize-none"
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider block mb-1">
              Horizonte
            </label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(e.target.value as TaskHorizon)}
              className="w-full bg-surface-200 border border-surface-400 rounded px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-accent"
            >
              <option value="short">Corto plazo</option>
              <option value="medium">Medio plazo</option>
              <option value="long">Largo plazo</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider block mb-1">
              Asignado a
            </label>
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value as TaskAssignee)}
              className="w-full bg-surface-200 border border-surface-400 rounded px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-accent"
            >
              <option value="both">Ambos</option>
              <option value="player1">Jugador 1</option>
              <option value="player2">Jugador 2</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!title.trim() || loading}>
            {loading ? 'Guardando...' : 'Crear tarea'}
          </Button>
        </div>
      </div>
    </Card>
  )
}

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'pending', label: 'Pendiente' },
  { status: 'inprogress', label: 'En progreso' },
  { status: 'completed', label: 'Completado' },
]

export function Tareas() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filterHorizon, setFilterHorizon] = useState<TaskHorizon | 'all'>('all')
  const [filterAssignee, setFilterAssignee] = useState<TaskAssignee | 'all'>('all')

  useEffect(() => {
    const unsub = subscribeTasks(setTasks)
    return unsub
  }, [])

  function handleUpdate(id: string, data: Partial<Task>) {
    updateTask(id, data)
  }

  function handleDelete(id: string) {
    deleteTask(id)
  }

  const sessionGoals = tasks.filter((t) => t.isSessionGoal)

  const filtered = tasks.filter((t) => {
    if (filterHorizon !== 'all' && t.horizon !== filterHorizon) return false
    if (filterAssignee !== 'all' && t.assignee !== filterAssignee) return false
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-rajdhani text-3xl font-bold text-gray-100">
            Gestor de Tareas
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sincronizado entre ambos jugadores en tiempo real
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={14} />
          Nueva tarea
        </Button>
      </div>

      {showForm && <NewTaskForm onClose={() => setShowForm(false)} />}

      {/* Objetivos de sesión */}
      {sessionGoals.length > 0 && (
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Target size={15} className="text-accent" />
            <h2 className="font-rajdhani font-semibold text-gray-100">
              Objetivos de esta sesión
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {sessionGoals.map((task) => (
              <label key={task.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={(e) => handleUpdate(task.id, {
                    status: e.target.checked ? 'completed' : 'inprogress',
                    completedInSession: e.target.checked,
                  })}
                  className="accent-[#E8630A] w-4 h-4"
                />
                <span className={`text-sm transition-colors ${
                  task.status === 'completed'
                    ? 'line-through text-gray-600'
                    : 'text-gray-200 group-hover:text-white'
                }`}>
                  {task.title}
                </span>
                <Badge variant={horizonVariants[task.horizon]}>
                  {horizonLabels[task.horizon]}
                </Badge>
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <Clock size={13} className="text-gray-500" />
          {(['all', 'short', 'medium', 'long'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setFilterHorizon(h)}
              className={`px-3 py-1 rounded text-xs font-rajdhani transition-colors ${
                filterHorizon === h
                  ? 'bg-accent text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-surface-200'
              }`}
            >
              {h === 'all' ? 'Todos' : horizonLabels[h]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-4">
          {(['all', 'player1', 'player2', 'both'] as const).map((a) => (
            <button
              key={a}
              onClick={() => setFilterAssignee(a)}
              className={`px-3 py-1 rounded text-xs font-rajdhani transition-colors ${
                filterAssignee === a
                  ? 'bg-accent text-white'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-surface-200'
              }`}
            >
              {a === 'all' ? 'Todos' : assigneeLabels[a]}
            </button>
          ))}
        </div>
      </div>

      {/* Tablero Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(({ status, label }) => {
          const columnTasks = filtered.filter((t) => t.status === status)
          return (
            <div key={status} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-rajdhani font-semibold text-gray-400 uppercase text-xs tracking-wider">
                  {label}
                </h3>
                <span className="text-xs font-mono text-gray-600">{columnTasks.length}</span>
              </div>
              <div className="flex flex-col gap-2 min-h-24">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="border border-dashed border-surface-300 rounded-lg h-24 flex items-center justify-center">
                    <span className="text-xs text-gray-600">Sin tareas</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}