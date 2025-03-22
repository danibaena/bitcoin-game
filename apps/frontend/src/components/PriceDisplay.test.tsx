import { useGame } from "@/lib/providers"
import { renderWithProviders } from "@/mocks/utils"
import { screen } from "@testing-library/react"
import { PriceDisplay } from "./PriceDisplay"

vi.mock(import("@/lib/providers"), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useGame: vi.fn(),
  }
})

describe("PriceDisplay", () => {
  it("displays loading spinner when price is loading", () => {
    vi.mocked(useGame).mockReturnValue({
      price: {
        currentPrice: null,
        isLoadingPrice: true,
      },
    } as never)

    renderWithProviders(<PriceDisplay />)

    expect(screen.getByText("Current price is:")).toBeDefined()
    expect(screen.getByTestId("loading-spinner")).toBeDefined()
  })

  it("displays price when loaded", () => {
    const mockPrice = 45000

    vi.mocked(useGame).mockReturnValue({
      price: {
        currentPrice: mockPrice,
        isLoadingPrice: false,
      },
    } as never)

    renderWithProviders(<PriceDisplay />)

    expect(screen.getByText("Current price is:")).toBeDefined()
    expect(screen.getByText("$45,000")).toBeDefined()
  })

  it("displays loading spinner when price is undefined", () => {
    vi.mocked(useGame).mockReturnValue({
      price: {
        currentPrice: undefined,
        isLoadingPrice: false,
      },
    } as never)

    renderWithProviders(<PriceDisplay />)

    expect(screen.getByTestId("loading-spinner")).toBeDefined()
  })
})
