function ProgressBar({ name, count, maxCount }) {
  const percent = maxCount > 0 ? (count / maxCount) * 100 : 0

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-200">{name}</span>
        <span className="text-gray-400">{count} tasks</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
