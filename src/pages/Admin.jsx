import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllBoards, deleteBoard } from '../lib/db.js'

function Admin() {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllBoards()
        setBoards(data)
      } catch (err) {
        console.error('Failed to load boards:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function copyLink(boardId) {
    const url = `${window.location.origin}/kanban-board/board/${boardId}`
    navigator.clipboard.writeText(url)
    setCopiedId(boardId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-lg space-y-8">
        <div>
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-200">
            &larr; Home
          </Link>
          <h1 className="mt-2 text-3xl font-bold">All Boards</h1>
          <p className="mt-1 text-gray-400">
            Find and share board links
          </p>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : boards.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center text-gray-500">
            No boards yet.{' '}
            <Link to="/" className="text-blue-400 hover:underline">
              Create one
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {boards.map((board) => (
              <div
                key={board.id}
                className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-900 p-4"
              >
                <div>
                  <Link
                    to={`/board/${board.id}`}
                    className="font-medium text-blue-400 hover:underline"
                  >
                    {board.name}'s Board
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-500">
                    ID: {board.id}
                  </p>
                  <p className="text-xs text-gray-600">
                    Created: {new Date(board.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyLink(board.id)}
                    className="rounded-lg border border-gray-700 px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-800"
                  >
                    {copiedId === board.id ? 'Copied!' : 'Copy link'}
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm(`Delete "${board.name}'s Board"? This removes all its tasks too.`)) {
                        await deleteBoard(board.id)
                        setBoards((prev) => prev.filter((b) => b.id !== board.id))
                      }
                    }}
                    className="rounded-lg border border-red-900 px-3 py-1.5 text-sm text-red-400 hover:bg-red-950"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
