import { useGame } from "@/lib/providers"
import { renderWithProviders } from "@/mocks/utils"
import { GuessDirection } from "@/types"
import { fireEvent, screen } from "@testing-library/react"
import { GuessButtons } from "./GuessButtons"

vi.mock(import("@/lib/providers"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useGame: vi.fn(),
  }
})

describe("GuessButtons", () => {
  const mockMakeGuess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows both buttons to make guesses", () => {
    vi.mocked(useGame).mockReturnValue({
      score: {
        isLoadingSession: false,
      },
      guess: {
        makeGuess: mockMakeGuess,
        isGuessing: false,
      },
    } as never)

    renderWithProviders(<GuessButtons />)

    expect(screen.getByText(/Price will go lower/i)).toBeDefined()
    expect(screen.getByText(/Price will go higher/i)).toBeDefined()
  })

  it("makes the guess when the lower button is clicked", () => {
    vi.mocked(useGame).mockReturnValue({
      score: {
        isLoadingSession: false,
      },
      guess: {
        makeGuess: mockMakeGuess,
        isGuessing: false,
      },
    } as never)

    renderWithProviders(<GuessButtons />)

    fireEvent.click(screen.getByText(/Price will go lower/i))

    expect(mockMakeGuess).toHaveBeenCalledWith(GuessDirection.down)
  })

  it("makes the guess when the higher button is clicked", () => {
    vi.mocked(useGame).mockReturnValue({
      score: {
        isLoadingSession: false,
      },
      guess: {
        makeGuess: mockMakeGuess,
        isGuessing: false,
      },
    } as never)

    renderWithProviders(<GuessButtons />)

    fireEvent.click(screen.getByText(/Price will go higher/i))

    expect(mockMakeGuess).toHaveBeenCalledWith(GuessDirection.up)
  })

  it("disables buttons when is guessing", () => {
    vi.mocked(useGame).mockReturnValue({
      score: {
        isLoadingSession: false,
      },
      guess: {
        makeGuess: mockMakeGuess,
        isGuessing: true,
      },
    } as never)

    renderWithProviders(<GuessButtons />)

    const lowerButton = screen.getByText(/Price will go lower/i).closest("button")
    const higherButton = screen.getByText(/Price will go higher/i).closest("button")

    expect(lowerButton?.disabled).toBe(true)
    expect(higherButton?.disabled).toBe(true)
  })

  it("disables buttons when is loading session", () => {
    vi.mocked(useGame).mockReturnValue({
      score: {
        isLoadingSession: true,
      },
      guess: {
        makeGuess: mockMakeGuess,
        isGuessing: false,
      },
    } as never)

    renderWithProviders(<GuessButtons />)

    const lowerButton = screen.getByText(/Price will go lower/i).closest("button")
    const higherButton = screen.getByText(/Price will go higher/i).closest("button")

    expect(lowerButton?.disabled).toBe(true)
    expect(higherButton?.disabled).toBe(true)
  })
})
