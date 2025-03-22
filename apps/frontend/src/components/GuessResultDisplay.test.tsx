import { SHOW_RESULT_MILLISECONDS } from "@/constants"
import { useGame } from "@/lib/providers"
import { renderWithProviders } from "@/mocks/utils"
import { GuessDirection } from "@/types"
import { act, screen } from "@testing-library/react"
import { GuessResultDisplay } from "./GuessResultDisplay"

vi.mock(import("@/lib/providers"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useGame: vi.fn(),
  }
})

describe("GuessResultDisplay", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("doesn't render when guessResolved is false", () => {
    vi.mocked(useGame).mockReturnValue({
      guess: {
        guessResolved: false,
        lastGuessDirection: GuessDirection.up,
        isLastGuessCorrect: true,
      },
      price: {
        priceAtGuessTime: 45000,
        comparedPrice: 46000,
      },
    } as never)

    renderWithProviders(<GuessResultDisplay />)

    expect(screen.queryByText(/Correct guess!/)).toBeNull()
  })

  it("shows correct guess result when price went higher", () => {
    vi.mocked(useGame).mockReturnValue({
      guess: {
        guessResolved: true,
        lastGuessDirection: GuessDirection.up,
        isLastGuessCorrect: true,
      },
      price: {
        priceAtGuessTime: 45000,
        comparedPrice: 46000,
      },
    } as never)

    renderWithProviders(<GuessResultDisplay />)

    expect(screen.getByText(/Correct guess!/)).toBeDefined()
    expect(screen.getByText(/Price went higher/)).toBeDefined()
    expect(screen.getByText("$45,000")).toBeDefined()
    expect(screen.getByText("$46,000")).toBeDefined()
    expect(screen.getByText("+1 point")).toBeDefined()
  })

  it("shows incorrect guess result when price went lower", () => {
    vi.mocked(useGame).mockReturnValue({
      guess: {
        guessResolved: true,
        lastGuessDirection: GuessDirection.down,
        isLastGuessCorrect: false,
      },
      price: {
        priceAtGuessTime: 45000,
        comparedPrice: 44000,
      },
    } as never)

    renderWithProviders(<GuessResultDisplay />)

    expect(screen.getByText(/Incorrect guess!/)).toBeDefined()
    expect(screen.getByText(/Price went lower/)).toBeDefined()
    expect(screen.getByText("-1 point")).toBeDefined()
  })

  it("hides result after timeout", async () => {
    vi.mocked(useGame).mockReturnValue({
      guess: {
        guessResolved: true,
        lastGuessDirection: GuessDirection.up,
        isLastGuessCorrect: true,
      },
      price: {
        priceAtGuessTime: 45000,
        comparedPrice: 46000,
      },
    } as never)

    renderWithProviders(<GuessResultDisplay />)

    expect(screen.getByText(/Correct guess!/)).toBeDefined()

    await act(() => vi.advanceTimersByTimeAsync(SHOW_RESULT_MILLISECONDS + 100))

    expect(screen.queryByText(/Correct guess!/)).toBeNull()
  })
})
