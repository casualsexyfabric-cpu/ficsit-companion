import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Task, TaskStatus, TaskHorizon, TaskAssignee } from '@/types'

const COLLECTION = 'tasks'

export function subscribeTasks(callback: (tasks: Task[]) => void) {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() ?? new Date(),
      updatedAt: doc.data().updatedAt?.toDate() ?? new Date(),
    })) as Task[]
    callback(tasks)
  })
}

export async function createTask(data: {
  title: string
  description?: string
  horizon: TaskHorizon
  assignee: TaskAssignee
}) {
  await addDoc(collection(db, COLLECTION), {
    ...data,
    status: 'pending' as TaskStatus,
    isSessionGoal: false,
    completedInSession: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateTask(id: string, data: Partial<Omit<Task, 'id'>>) {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteTask(id: string) {
  await deleteDoc(doc(db, COLLECTION, id))
}