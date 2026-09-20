import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { fireEvent } from "@testing-library/react"
import { SoftUiStudiesPage } from "../blocks/soft-ui-studies-page"

it("keeps sample balances consistent and each exploration independent", async () => {
  const user = userEvent.setup()
  const { container } = render(<SoftUiStudiesPage />)
  const editorial = within(container.querySelector("#editorial") as HTMLElement)
  const tactile = within(container.querySelector("#tactile") as HTMLElement)
  expect(editorial.getByText("$1,765")).toBeInTheDocument()
  fireEvent.change(editorial.getByRole("slider"), { target: { value: "500" } })
  expect(editorial.getByText("$1,515")).toBeInTheDocument()
  expect(tactile.getByText("$1,765")).toBeInTheDocument()
  await user.click(editorial.getByRole("button", { name: "Next month in Soft editorial" }))
  expect(editorial.getByText("$1,585")).toBeInTheDocument()
  expect(editorial.getByRole("button", { name: "Next month in Soft editorial" })).toBeDisabled()
  const name = editorial.getByRole("textbox", { name: "Goal name" })
  await user.clear(name)
  await user.type(name, "Summer trip")
  await user.click(editorial.getByRole("button", { name: "Save goal" }))
  expect(editorial.getByRole("heading", { name: "Summer trip" })).toBeInTheDocument()
  expect(editorial.getByRole("status")).toHaveTextContent("Saved for this preview session.")
  await user.click(screen.getByRole("button", { name: "Compare original geometry" }))
  expect(container.querySelectorAll(".soft-baseline")).toHaveLength(4)
})
