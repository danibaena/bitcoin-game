import { useGuess } from "@/hooks/useGuess"
import { GuessDirection } from "@/types"
import { act, renderHook } from "@testing-library/react"
import { describe, expect, it } from "vitest"

describe("useGuess", () => {
  it("should initialize with null values", () => {
    const { result } = renderHook(() => useGuess())

    expect(result.current.currentGuess).toBeNull()
    expect(result.current.guessTimestamp).toBeNull()
  })

  it("should make a guess successfully when no active guess exists", () => {
    const { result } = renderHook(() => useGuess())

    let success
    act(() => {
      success = result.current.makeGuess(GuessDirection.up)
    })

    expect(success).toBe(true)
    expect(result.current.currentGuess).toBe(GuessDirection.up)
    expect(result.current.guessTimestamp).not.toBeNull()
  })

  it("should reject a guess when one is already active", () => {
    const { result } = renderHook(() => useGuess())

    act(() => {
      result.current.makeGuess(GuessDirection.up)
    })

    let secondGuessSuccess
    act(() => {
      secondGuessSuccess = result.current.makeGuess(GuessDirection.down)
    })

    expect(secondGuessSuccess).toBe(false)
    expect(result.current.currentGuess).toBe(GuessDirection.up)
  })

  it("should reset the guess state", () => {
    const { result } = renderHook(() => useGuess())

    act(() => {
      result.current.makeGuess(GuessDirection.up)
    })

    act(() => {
      result.current.resetGuess()
    })

    expect(result.current.currentGuess).toBeNull()
    expect(result.current.guessTimestamp).toBeNull()
  })
})
