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

  it("renders up and down buttons", () => {
    vi.mocked(useGame).mockReturnValue({
      guess: {
        makeGuess: mockMakeGuess,
        isGuessing: false,
      },
    } as never)

    renderWithProviders(<GuessButtons />)

    expect(screen.getByText(/Price will go lower/i)).toBeDefined()
    expect(screen.getByText(/Price will go higher/i)).toBeDefined()
  })

  it("calls makeGuess with DOWN direction when lower button is clicked", () => {
    vi.mocked(useGame).mockReturnValue({
      guess: {
        makeGuess: mockMakeGuess,
        isGuessing: false,
      },
    } as never)

    renderWithProviders(<GuessButtons />)

    fireEvent.click(screen.getByText(/Price will go lower/i))

    expect(mockMakeGuess).toHaveBeenCalledWith(GuessDirection.down)
  })

  it("calls makeGuess with UP direction when higher button is clicked", () => {
    vi.mocked(useGame).mockReturnValue({
      guess: {
        makeGuess: mockMakeGuess,
        isGuessing: false,
      },
    } as never)

    renderWithProviders(<GuessButtons />)

    fireEvent.click(screen.getByText(/Price will go higher/i))

    expect(mockMakeGuess).toHaveBeenCalledWith(GuessDirection.up)
  })

  it("disables buttons when isGuessing is true", () => {
    vi.mocked(useGame).mockReturnValue({
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
})
