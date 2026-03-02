import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createBoard } from '../lib/db.js'

function Home() {
  const [name, setName] = useState('')
  const [boardCode, setBoardCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      const board = await createBoard(name.trim())
      navigate(`/board/${board.id}`)
    } catch (err) {
      setError('Failed to create board. Check your Supabase connection.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleJoin(e) {
    e.preventDefault()
    if (!boardCode.trim()) return
    navigate(`/board/${boardCode.trim()}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Kanban Board</h1>
          <p className="mt-2 text-gray-400">
            Personal productivity tracker with weekly progress
          </p>
        </div>

        {/* Create new board */}
        <form onSubmit={handleCreate} className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Create a new board
          </label>
          <input
            type="text"
            placeholder="Your name (e.g. Edwin)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Board'}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-700" />
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-700" />
        </div>

        {/* Join existing board */}
        <form onSubmit={handleJoin} className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Open an existing board
          </label>
          <input
            type="text"
            placeholder="Paste board ID"
            value={boardCode}
            onChange={(e) => setBoardCode(e.target.value)}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!boardCode.trim()}
            className="w-full rounded-lg border border-gray-600 px-4 py-3 font-medium text-gray-300 hover:bg-gray-800 disabled:opacity-50"
          >
            Open Board
          </button>
        </form>

        {error && (
          <p className="text-center text-sm text-red-400">{error}</p>
        )}

        {/* Quick links */}
        <div className="flex justify-center gap-4 pt-4 text-sm text-gray-500">
          <a href="/kanban-board/progress" className="hover:text-gray-300">
            Weekly Progress
          </a>
          <span>|</span>
          <a href="/kanban-board/admin" className="hover:text-gray-300">
            All Boards
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home
