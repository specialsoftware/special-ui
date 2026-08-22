import { render, screen } from "@testing-library/react"

import { Field, FieldDescription, FieldError, FieldLabel } from "./field"
import { Input } from "./input"

describe("Input and Field", () => {
  it("associates labels, descriptions, and validation errors", () => {
    render(
      <Field data-invalid="true">
        <FieldLabel htmlFor="email">Billing email</FieldLabel>
        <Input id="email" aria-describedby="email-description email-error" aria-invalid="true" />
        <FieldDescription id="email-description">Used for receipts.</FieldDescription>
        <FieldError id="email-error">Enter a valid email.</FieldError>
      </Field>
    )

    expect(screen.getByRole("textbox", { name: "Billing email" })).toHaveAccessibleDescription(
      "Used for receipts. Enter a valid email."
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email.")
  })

  it("applies the selected control size without leaking the prop", () => {
    render(<Input aria-label="Workspace" inputSize="lg" />)

    const input = screen.getByRole("textbox", { name: "Workspace" })
    expect(input).toHaveClass("h-10")
    expect(input).not.toHaveAttribute("inputSize")
  })
})
