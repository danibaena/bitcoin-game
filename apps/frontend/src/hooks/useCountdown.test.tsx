import { COUNTDOWN_INTERVAL_MILLISECONDS, useCountdown } from "@/hooks"
import { act, renderHook } from "@testing-library/react"
import { vi } from "vitest"

describe("useCountdown hook", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should initialize with the given value", () => {
    const { result } = renderHook(() => useCountdown(10))

    expect(result.current.countdown).toBe(10)
  })

  it("should decrement countdown every second", () => {
    const { result } = renderHook(() => useCountdown(3))

    act(() => {
      vi.advanceTimersByTime(COUNTDOWN_INTERVAL_MILLISECONDS)
    })
    expect(result.current.countdown).toBe(2)

    act(() => {
      vi.advanceTimersByTime(COUNTDOWN_INTERVAL_MILLISECONDS)
    })
    expect(result.current.countdown).toBe(1)

    act(() => {
      vi.advanceTimersByTime(COUNTDOWN_INTERVAL_MILLISECONDS)
    })
    expect(result.current.countdown).toBe(null)
  })

  it("should start countdown when startCountdown is called", () => {
    const { result } = renderHook(() => useCountdown(null))

    act(() => {
      result.current.startCountdown(5)
    })
    expect(result.current.countdown).toBe(5)

    act(() => {
      vi.advanceTimersByTime(COUNTDOWN_INTERVAL_MILLISECONDS)
    })
    expect(result.current.countdown).toBe(4)
  })

  it("should stop countdown when stopCountdown is called", () => {
    const { result } = renderHook(() => useCountdown(5))

    act(() => {
      result.current.stopCountdown()
    })
    expect(result.current.countdown).toBe(null)
  })

  it("should not decrement if countdown is null", () => {
    const { result } = renderHook(() => useCountdown(null))
    act(() => {
      vi.advanceTimersByTime(COUNTDOWN_INTERVAL_MILLISECONDS)
    })
    expect(result.current.countdown).toBe(null)
  })
})
