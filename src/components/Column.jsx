import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Card from './Card.jsx'
import AddCard from './AddCard.jsx'

const COLUMN_CONFIG = {
  todo: { title: 'To Do', color: 'border-t-blue-500' },
  in_progress: { title: 'In Progress', color: 'border-t-yellow-500' },
  done: { title: 'Done', color: 'border-t-green-500' },
}

function Column({ columnId, tasks, boardId, onRefresh }) {
  const config = COLUMN_CONFIG[columnId]
  const { setNodeRef, isOver } = useDroppable({ id: columnId })
  const taskIds = tasks.map((t) => t.id)

  return (
    <div
      ref={setNodeRef}
      className={`flex w-80 shrink-0 flex-col rounded-xl border border-gray-800 border-t-4 bg-gray-900 ${config.color} ${
        isOver ? 'ring-2 ring-blue-500/50' : ''
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="font-semibold text-gray-200">{config.title}</h2>
        <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <Card key={task.id} task={task} onRefresh={onRefresh} />
          ))}
        </SortableContext>
        <AddCard boardId={boardId} column={columnId} onRefresh={onRefresh} />
      </div>
    </div>
  )
}

export default Column
