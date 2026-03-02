import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Board from '../components/Board.jsx'
import { getBoard } from '../lib/db.js'

function BoardPage() {
  const { boardId } = useParams()
  const [board, setBoard] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await getBoard(boardId)
        setBoard(data)
      } catch {
        setError('Board not found. Check the ID and try again.')
      }
    }
    load()
  }, [boardId])

  function copyLink() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error}</p>
        <Link to="/" className="text-blue-400 hover:underline">
          Go home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-400 hover:text-gray-200">
            Home
          </Link>
          <span className="text-gray-700">/</span>
          <h1 className="text-xl font-bold">
            {board?.name || 'Loading...'}'s Board
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={copyLink}
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
          >
            {copied ? 'Copied!' : 'Share link'}
          </button>
          <Link
            to="/progress"
            className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
          >
            Progress
          </Link>
        </div>
      </header>

      {/* Board */}
      <Board boardId={boardId} />
    </div>
  )
}

export default BoardPage
