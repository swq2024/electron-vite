interface FailedQueue {
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}
