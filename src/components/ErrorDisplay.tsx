interface ErrorDisplayProps {
  error: Error;
}

export default function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 border-2 border-red-500/20 rounded-lg">
      <p className="text-xl text-red-500 mb-4">글을 불러오는데 실패했습니다</p>
      <p className="text-sm text-red-400">{error.message}</p>
    </div>
  );
}
