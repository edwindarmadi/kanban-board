import { useState, useEffect, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import Column from './Column.jsx'
import { getTasks, updateTask, subscribeToTasks } from '../lib/db.js'

const COLUMNS = ['todo', 'in_progress', 'done']

function Board({ boardId }) {
  const [tasks, setTasks] = useState([])
  const [activeTask, setActiveTask] = useState(null)
  const [loading, setLoading] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks(boardId)
      setTasks(data)
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [boardId])

  useEffect(() => {
    fetchTasks()
    const unsubscribe = subscribeToTasks(boardId, fetchTasks)
    return unsubscribe
  }, [boardId, fetchTasks])

  function handleDragStart(event) {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  async function handleDragEnd(event) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const taskId = active.id
    // Determine target column: if dropped on a column directly, use that;
    // if dropped on another card, use that card's column
    let targetColumn = null
    if (COLUMNS.includes(over.id)) {
      targetColumn = over.id
    } else {
      const overTask = tasks.find((t) => t.id === over.id)
      if (overTask) targetColumn = overTask.column
    }

    if (!targetColumn) return

    const task = tasks.find((t) => t.id === taskId)
    if (task && task.column !== targetColumn) {
      // Optimistic update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, column: targetColumn } : t
        )
      )
      await updateTask(taskId, { column: targetColumn })
      fetchTasks()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-400">
        Loading board...
      </div>
    )
  }

  const tasksByColumn = {}
  for (const col of COLUMNS) {
    tasksByColumn[col] = tasks.filter((t) => t.column === col)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto p-6">
        {COLUMNS.map((col) => (
          <Column
            key={col}
            columnId={col}
            tasks={tasksByColumn[col]}
            boardId={boardId}
            onRefresh={fetchTasks}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="rounded-lg border border-blue-500 bg-gray-800 p-3 shadow-xl">
            <p className="text-sm text-gray-200">{activeTask.title}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default Board
