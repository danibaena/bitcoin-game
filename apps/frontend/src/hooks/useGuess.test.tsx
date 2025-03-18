import { GuessDirection, useGuess } from "@/hooks"
import { act, renderHook } from "@testing-library/react"

describe("useGuess hook", () => {
  it("should initialize with null values", () => {
    const { result } = renderHook(() => useGuess())

    expect(result.current.currentGuess).toBeNull()
    expect(result.current.guessTimestamp).toBeNull()
  })

  it("should set guess and timestamp when making a guess", () => {
    const { result } = renderHook(() => useGuess())

    act(() => {
      result.current.makeGuess(GuessDirection.up)
    })

    expect(result.current.currentGuess).toBe(GuessDirection.up)
    expect(result.current.guessTimestamp).not.toBeNull()
  })

  it("should not change guess if already set", () => {
    const { result } = renderHook(() => useGuess())

    act(() => {
      result.current.makeGuess(GuessDirection.up)
    })
    const firstTimestamp = result.current.guessTimestamp

    act(() => {
      const secondAttempt = result.current.makeGuess(GuessDirection.down)
      expect(secondAttempt).toBe(false)
    })

    expect(result.current.currentGuess).toBe(GuessDirection.up)
    expect(result.current.guessTimestamp).toBe(firstTimestamp)
  })

  it("should reset guess and timestamp", () => {
    const { result } = renderHook(() => useGuess())

    act(() => {
      result.current.makeGuess(GuessDirection.down)
    })

    act(() => {
      result.current.resetGuess()
    })

    expect(result.current.currentGuess).toBeNull()
    expect(result.current.guessTimestamp).toBeNull()
  })
})
