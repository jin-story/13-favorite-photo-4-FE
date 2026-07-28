export default function Loading() {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-black"
      aria-label="페이지를 불러오는 중"
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="size-10 animate-spin rounded-full border-4 border-gray-400 border-t-main"
          role="status"
        >
          <span className="sr-only">로딩 중...</span>
        </div>

        <p className="text-noto-16-regular text-gray-300">로딩 중...</p>
      </div>
    </main>
  );
}
