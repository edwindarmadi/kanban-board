import { useState } from 'react'
import { createTask } from '../lib/db.js'

function AddCard({ boardId, column, onRefresh }) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    await createTask(boardId, title.trim(), column)
    setTitle('')
    setAdding(false)
    onRefresh()
  }

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="w-full rounded-lg border border-dashed border-gray-700 px-3 py-2 text-sm text-gray-500 hover:border-gray-500 hover:text-gray-300"
      >
        + Add task
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title..."
        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setAdding(false)
            setTitle('')
          }}
          className="rounded px-3 py-1 text-sm text-gray-400 hover:text-gray-200"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default AddCard
