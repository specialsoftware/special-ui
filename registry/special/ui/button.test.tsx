import { render, screen } from "@testing-library/react"

import { Button } from "./button"

describe("Button", () => {
  it("renders an accessible native button", () => {
    render(<Button>Save changes</Button>)

    expect(screen.getByRole("button", { name: "Save changes" })).toHaveAttribute(
      "data-slot",
      "button"
    )
  })

  it("keeps its accessible name while loading", () => {
    render(<Button loading>Saving changes</Button>)

    const button = screen.getByRole("button", { name: "Saving changes" })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute("aria-busy", "true")
    expect(button.querySelector('[data-slot="button-spinner"]')).toBeInTheDocument()
  })

  it("lets consumer utility classes override built-in classes", () => {
    render(<Button className="h-12 rounded-none">Custom</Button>)

    const button = screen.getByRole("button", { name: "Custom" })
    expect(button).toHaveClass("h-12", "rounded-none")
    expect(button).not.toHaveClass("h-9", "rounded-md")
  })
})
