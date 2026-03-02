import { supabase } from './supabase.js'

// ─── Boards ────────────────────────────────────────────────

export async function createBoard(name) {
  const { data, error } = await supabase
    .from('boards')
    .insert({ name })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getBoard(boardId) {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('id', boardId)
    .single()
  if (error) throw error
  return data
}

export async function getAllBoards() {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// ─── Tasks ─────────────────────────────────────────────────

export async function getTasks(boardId) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('board_id', boardId)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function createTask(boardId, title, column = 'todo') {
  // Get the max position for this column so the new task goes at the end
  const { data: existing } = await supabase
    .from('tasks')
    .select('position')
    .eq('board_id', boardId)
    .eq('column', column)
    .order('position', { ascending: false })
    .limit(1)

  const nextPosition = existing?.length > 0 ? existing[0].position + 1 : 0

  const { data, error } = await supabase
    .from('tasks')
    .insert({ board_id: boardId, title, column, position: nextPosition })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateTask(taskId, updates) {
  // If moving to "done", record the completion time
  if (updates.column === 'done') {
    updates.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTask(taskId) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) throw error
}

// ─── Progress / Stats ──────────────────────────────────────

export async function getWeeklyStats() {
  // Get the start of the current week (Monday)
  const now = new Date()
  const dayOfWeek = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  monday.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('tasks')
    .select('board_id, completed_at, boards(name)')
    .eq('column', 'done')
    .gte('completed_at', monday.toISOString())
  if (error) throw error

  // Group by board
  const stats = {}
  for (const task of data || []) {
    const boardName = task.boards?.name || task.board_id
    stats[boardName] = (stats[boardName] || 0) + 1
  }
  return stats
}

// ─── Real-time subscription ────────────────────────────────

export function subscribeToTasks(boardId, callback) {
  const channel = supabase
    .channel(`tasks:${boardId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `board_id=eq.${boardId}`,
      },
      () => callback()
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}
