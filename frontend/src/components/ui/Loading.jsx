function Loading({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />

      <span className="text-sm text-gray-600">
        {message}
      </span>
    </div>
  );
}

export default Loading;