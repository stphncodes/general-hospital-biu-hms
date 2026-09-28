// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { FormTextField, useZodForm } from "@/components/forms";

const schema = z.object({
  reference: z.string().trim().min(1, "Reference is required."),
});

function ExampleForm({
  onValid,
}: {
  onValid: (values: z.output<typeof schema>) => void;
}) {
  const form = useZodForm(schema, { defaultValues: { reference: "" } });
  return (
    <form onSubmit={form.handleSubmit(onValid)} noValidate>
      <FormTextField
        control={form.control}
        name="reference"
        label="Reference"
        description="Printed on the form header."
        required
      />
      <button type="submit">Save</button>
    </form>
  );
}

describe("form pattern (React Hook Form + Zod + FormTextField)", () => {
  it("shows an accessible validation error and blocks submission", async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();
    render(<ExampleForm onValid={onValid} />);

    await user.click(screen.getByRole("button", { name: "Save" }));

    const input = screen.getByLabelText(/Reference/);
    expect(await screen.findByText("Reference is required.")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/form header.*required/i);
    expect(onValid).not.toHaveBeenCalled();
  });

  it("submits the parsed (trimmed) output once valid", async () => {
    const user = userEvent.setup();
    const onValid = vi.fn();
    render(<ExampleForm onValid={onValid} />);

    await user.type(screen.getByLabelText(/Reference/), "  REF-001  ");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onValid).toHaveBeenCalledWith({ reference: "REF-001" }, expect.anything());
  });
});
