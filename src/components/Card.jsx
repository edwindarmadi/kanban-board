import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { updateTask, deleteTask } from '../lib/db.js'

function Card({ task, onRefresh }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { column: task.column } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  async function handleSave() {
    if (title.trim() && title !== task.title) {
      await updateTask(task.id, { title: title.trim() })
      onRefresh()
    }
    setEditing(false)
  }

  async function handleDelete() {
    await deleteTask(task.id)
    onRefresh()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group rounded-lg border border-gray-700 bg-gray-800 p-3"
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab text-gray-500 hover:text-gray-300 active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          ⠿
        </button>

        {/* Title (click to edit) */}
        <div className="flex-1">
          {editing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full rounded bg-gray-900 px-2 py-1 text-sm text-white focus:outline-none"
              autoFocus
            />
          ) : (
            <p
              onClick={() => setEditing(true)}
              className="cursor-text text-sm text-gray-200"
            >
              {task.title}
            </p>
          )}
        </div>

        {/* Delete button (visible on hover) */}
        <button
          onClick={handleDelete}
          className="text-gray-600 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
          aria-label="Delete task"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Card
