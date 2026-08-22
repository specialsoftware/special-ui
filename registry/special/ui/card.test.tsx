import { render, screen } from "@testing-library/react"

import { Card, CardContent, CardHeader, CardTitle } from "./card"

describe("Card", () => {
  it("composes semantic slots", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent>Special Software</CardContent>
      </Card>
    )

    expect(screen.getByText("Workspace")).toHaveAttribute("data-slot", "card-title")
    expect(screen.getByText("Special Software")).toHaveAttribute("data-slot", "card-content")
  })

  it("exposes interactive and size state through data attributes", () => {
    const { container } = render(<Card interactive size="sm" aria-label="Open workspace" />)
    const card = container.querySelector('[data-slot="card"]')

    expect(card).toHaveAttribute("data-interactive", "true")
    expect(card).toHaveAttribute("data-size", "sm")
    expect(card).toHaveClass("cursor-pointer")
  })
})
