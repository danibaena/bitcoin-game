import { useGame } from "@/lib/providers"
import { renderWithProviders } from "@/mocks/utils"
import { screen } from "@testing-library/react"
import { ScoreDisplay } from "./ScoreDisplay"

vi.mock(import("@/lib/providers"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useGame: vi.fn(),
  }
})

describe("ScoreDisplay", () => {
  it("displays the score from context", () => {
    vi.mocked(useGame).mockReturnValue({
      score: 5,
    } as never)

    renderWithProviders(<ScoreDisplay />)

    expect(screen.getByText("Your score")).toBeDefined()
    expect(screen.getByText("5")).toBeDefined()
  })

  it("updates when score changes", () => {
    vi.mocked(useGame).mockReturnValue({
      score: 0,
    } as never)

    const { rerender } = renderWithProviders(<ScoreDisplay />)
    expect(screen.getByText("0")).toBeDefined()

    vi.mocked(useGame).mockReturnValue({
      score: 10,
    } as never)

    rerender(<ScoreDisplay />)
    expect(screen.getByText("10")).toBeDefined()
  })

  it("handles negative scores", () => {
    vi.mocked(useGame).mockReturnValue({
      score: -3,
    } as never)

    renderWithProviders(<ScoreDisplay />)
    expect(screen.getByText("-3")).toBeDefined()
  })
})
