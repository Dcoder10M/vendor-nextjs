const Loading = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
        <p className="text-xl font-medium text-gray-500">Loading...</p>
      </div>
    </div>
  )
}

export default Loading
