import Uppy from "@uppy/core"
import { UppyContextProvider } from "@uppy/react"
import { render, screen } from "@testing-library/react"

import { UppyFileUpload } from "./file-upload"

function createUppy() {
  return new Uppy({
    restrictions: {
      allowedFileTypes: [".csv", "text/csv"],
      maxNumberOfFiles: 10,
    },
  })
}

describe("UppyFileUpload", () => {
  it("renders an accessible multi-file drop target backed by Uppy", () => {
    const uppy = createUppy()

    render(
      <UppyContextProvider uppy={uppy}>
        <UppyFileUpload />
      </UppyContextProvider>
    )

    expect(screen.getByRole("button", { name: /drop bank statements/i })).toBeInTheDocument()
    expect(document.querySelector('input[type="file"]')).toHaveAttribute("multiple")

    uppy.destroy()
  })

  it("shows every selected file and exposes file-level recovery", () => {
    const uppy = createUppy()
    const firstId = uppy.addFile({
      name: "checking.csv",
      type: "text/csv",
      data: new File(["date,amount"], "checking.csv", { type: "text/csv" }),
    })
    uppy.addFile({
      name: "savings.csv",
      type: "text/csv",
      data: new File(["date,amount"], "savings.csv", { type: "text/csv" }),
    })
    uppy.setFileState(firstId, { error: "Connection interrupted" })

    render(
      <UppyContextProvider uppy={uppy}>
        <UppyFileUpload variant="ledger" />
      </UppyContextProvider>
    )

    expect(screen.getByText("checking.csv")).toBeInTheDocument()
    expect(screen.getByText("savings.csv")).toBeInTheDocument()
    expect(screen.getByText("Connection interrupted")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Retry checking.csv" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Remove savings.csv" })).toBeInTheDocument()

    uppy.destroy()
  })
})
