import { COUNTDOWN_INTERVAL_MILLISECONDS, TOTAL_COUNTDOWN_MILLISECONDS } from "@/constants"
import { useCountdown } from "@/hooks/useCountdown"
import { act, renderHook } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("useCountdown", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should initialize with null countdown", () => {
    const { result } = renderHook(() => useCountdown())
    expect(result.current.countdown).toBeNull()
  })

  it("should start countdown with proper initial value", () => {
    const { result } = renderHook(() => useCountdown())

    act(() => {
      result.current.startCountdown()
    })

    const expectedInitialCount = Math.ceil(TOTAL_COUNTDOWN_MILLISECONDS / COUNTDOWN_INTERVAL_MILLISECONDS)
    expect(result.current.countdown).toBe(expectedInitialCount)
  })

  it("should decrement countdown on interval", () => {
    const { result } = renderHook(() => useCountdown())

    act(() => {
      result.current.startCountdown()
    })

    const initialCount = result.current.countdown as number

    act(() => {
      vi.advanceTimersByTime(COUNTDOWN_INTERVAL_MILLISECONDS)
    })

    expect(result.current.countdown).toBe(initialCount - 1)
  })

  it("should stop countdown and set to null when complete", () => {
    const { result } = renderHook(() => useCountdown())

    act(() => {
      result.current.startCountdown()
    })

    const totalTime = COUNTDOWN_INTERVAL_MILLISECONDS * Math.ceil(TOTAL_COUNTDOWN_MILLISECONDS / COUNTDOWN_INTERVAL_MILLISECONDS)

    act(() => {
      vi.advanceTimersByTime(totalTime)
    })

    expect(result.current.countdown).toBeNull()
  })

  it("should stop countdown when requested", () => {
    const { result } = renderHook(() => useCountdown())

    act(() => {
      result.current.startCountdown()
    })

    act(() => {
      result.current.stopCountdown()
    })

    expect(result.current.countdown).toBeNull()
  })
})
