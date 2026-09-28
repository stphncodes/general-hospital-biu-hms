"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldValues, type UseFormProps } from "react-hook-form";
import type { z } from "zod";

/**
 * `useForm` bound to a Zod schema: the single way forms are created.
 *
 * - Field values are typed from the schema *input*; the submit handler
 *   receives the parsed schema *output* (after trims, coercions, defaults).
 * - Validation first runs when a field loses focus, then on every change,
 *   which avoids shouting at users while they are still typing.
 * - The same schema MUST be re-applied on the server (`parseInput`), because
 *   client validation can be bypassed.
 */
export function useZodForm<TInput extends FieldValues, TOutput extends FieldValues>(
  schema: z.ZodType<TOutput, TInput>,
  options?: Omit<UseFormProps<TInput, unknown, TOutput>, "resolver">,
) {
  return useForm<TInput, unknown, TOutput>({
    mode: "onTouched",
    ...options,
    resolver: zodResolver(schema),
  });
}
