import { useGame } from "@/lib/providers"
import { renderWithProviders } from "@/mocks/utils"
import { screen } from "@testing-library/react"
import { CountdownDisplay } from "./CountdownDisplay"

vi.mock(import("@/lib/providers"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useGame: vi.fn(),
  }
})

describe("CountdownDisplay", () => {
  it("renders countdown when guessing and countdown is available", () => {
    vi.mocked(useGame).mockReturnValue({
      countdown: {
        guessResolutionCountdown: 5,
      },
      guess: {
        isGuessing: true,
      },
    } as never)

    renderWithProviders(<CountdownDisplay />)

    expect(screen.getByText("Waiting for guess resolution: 5s")).toBeDefined()
  })

  it("doesn't render when not guessing", () => {
    vi.mocked(useGame).mockReturnValue({
      countdown: {
        guessResolutionCountdown: 5,
      },
      guess: {
        isGuessing: false,
      },
    } as never)

    renderWithProviders(<CountdownDisplay />)

    expect(screen.queryByText(/Waiting for guess resolution/)).toBeNull()
  })

  it("doesn't render when countdown is null", () => {
    vi.mocked(useGame).mockReturnValue({
      countdown: {
        guessResolutionCountdown: null,
      },
      guess: {
        isGuessing: true,
      },
    } as never)

    renderWithProviders(<CountdownDisplay />)

    expect(screen.queryByText(/Waiting for guess resolution/)).toBeNull()
  })

  it("updates when countdown changes", () => {
    vi.mocked(useGame).mockReturnValue({
      countdown: {
        guessResolutionCountdown: 5,
      },
      guess: {
        isGuessing: true,
      },
    } as never)

    const { rerender } = renderWithProviders(<CountdownDisplay />)
    expect(screen.getByText("Waiting for guess resolution: 5s")).toBeDefined()

    vi.mocked(useGame).mockReturnValue({
      countdown: {
        guessResolutionCountdown: 4,
      },
      guess: {
        isGuessing: true,
      },
    } as never)

    rerender(<CountdownDisplay />)
    expect(screen.getByText("Waiting for guess resolution: 4s")).toBeDefined()
  })
})
