import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar.jsx'
import { getWeeklyStats } from '../lib/db.js'

function Progress() {
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getWeeklyStats()
        setStats(data)
      } catch (err) {
        console.error('Failed to load stats:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const entries = Object.entries(stats)
  const maxCount = Math.max(...entries.map(([, count]) => count), 1)

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-lg space-y-8">
        <div>
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-200">
            &larr; Home
          </Link>
          <h1 className="mt-2 text-3xl font-bold">Weekly Progress</h1>
          <p className="mt-1 text-gray-400">
            Tasks completed this week (Mon–Sun)
          </p>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : entries.length === 0 ? (
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-8 text-center text-gray-500">
            No completed tasks this week yet. Get to work!
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-gray-800 bg-gray-900 p-6">
            {entries.map(([name, count]) => (
              <ProgressBar
                key={name}
                name={name}
                count={count}
                maxCount={maxCount}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Progress
