import { API_URL, COUNTDOWN_INTERVAL_MILLISECONDS, TOTAL_COUNTDOWN_MILLISECONDS } from "@/constants"
import { useGameState } from "@/hooks"
import { server } from "@/mocks/node"
import { createWrapper } from "@/mocks/utils"
import { GuessDirection } from "@/types"
import { act, renderHook, waitFor } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { describe, expect, it } from "vitest"

const currentPrice = 45000.25
const defaultScore = {
  score: 0,
  isLoadingSession: true,
}
const defaultPrice = {
  comparedPrice: null,
  currentPrice: currentPrice,
  isLoadingPrice: false,
  priceAtGuessTime: null,
}
const defaultCountdown = {
  guessResolutionCountdown: null,
}
const defaultGuess = {
  guessResolved: false,
  isGuessing: false,
  isLastGuessCorrect: null,
  lastGuessDirection: null,
}

describe("useGameState", () => {
  it("should initialize with default values", async () => {
    server.use(
      http.get(`${API_URL}/price`, async () => {
        return HttpResponse.json({ price: currentPrice, source: "api" }, { status: 200 })
      }),
    )

    const { result } = renderHook(() => useGameState(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.price).toEqual(defaultPrice))
    expect(result.current.score).toEqual(defaultScore)
    expect(result.current.countdown).toEqual(defaultCountdown)
    expect(result.current.guess).toMatchObject(defaultGuess)
  })

  describe("when making a guess", () => {
    it("starts the countdown and stores the price at guessing time", async () => {
      server.use(
        http.get(`${API_URL}/price`, async () => {
          return HttpResponse.json({ price: currentPrice, source: "api" }, { status: 200 })
        }),
      )

      const { result } = renderHook(() => useGameState(), { wrapper: createWrapper() })

      await waitFor(() => expect(result.current.price).toEqual(defaultPrice))
      act(() => {
        result.current.guess.makeGuess(GuessDirection.up)
      })
      await waitFor(() => expect(result.current.price).toEqual({ ...defaultPrice, priceAtGuessTime: currentPrice }))
      expect(result.current.countdown.guessResolutionCountdown).toBe(TOTAL_COUNTDOWN_MILLISECONDS / COUNTDOWN_INTERVAL_MILLISECONDS)
      expect(result.current.guess.isGuessing).toBe(true)
      expect(result.current.guess.guessResolved).toBe(false)
    })
  })
})
