import { renderWithProviders } from "@/mocks/utils"
import { screen } from "@testing-library/react"
import { Game } from "./Game"

describe("Game", () => {
  it("renders the game component with all sections", () => {
    renderWithProviders(<Game />)

    expect(screen.getByText("Bitcoin Price Guessing")).toBeDefined()
    expect(screen.getByText("What do you think the next price will be?")).toBeDefined()
    expect(screen.getByText("Your score")).toBeDefined()

    expect(screen.getByText("Current price is:")).toBeDefined()
    expect(screen.getByText("Price will go higher")).toBeDefined()
    expect(screen.getByText("Price will go lower")).toBeDefined()
  })

  it("has the correct layout structure", () => {
    renderWithProviders(<Game />)

    const header = screen.getByRole("banner")
    const section = document.querySelector("section")
    const footer = screen.getByRole("contentinfo")

    expect(header).toBeDefined()
    expect(section).toBeDefined()
    expect(footer).toBeDefined()
  })
})
