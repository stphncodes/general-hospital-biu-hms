"use client";

import { Loader2Icon, MailIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  applyActionError,
  FormRootError,
  FormSelectField,
  FormTextField,
  useZodForm,
  type SelectOption,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { inviteStaff } from "../actions/invite-staff";
import { inviteStaffSchema } from "../schemas/invite-staff";

const EMPTY = { fullName: "", email: "", jobTitle: "", roleId: "" };

export function InviteStaffSheet({ roles }: { roles: readonly SelectOption[] }) {
  const [open, setOpen] = useState(false);
  const form = useZodForm(inviteStaffSchema, { defaultValues: EMPTY });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await inviteStaff(values);
    if (!result.ok) {
      applyActionError(form, result.error);
      return;
    }
    toast.success(`Invitation sent to ${result.data.email}`, {
      description: "They will appear in the list as pending until they sign in.",
    });
    form.reset(EMPTY);
    setOpen(false);
  });

  const { isSubmitting, errors } = form.formState;

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset(EMPTY);
      }}
    >
      <SheetTrigger asChild>
        <Button className="h-10 px-4 font-semibold">
          <UserPlusIcon aria-hidden />
          Invite staff member
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg">Invite a staff member</SheetTitle>
          <SheetDescription>
            They will get an email with a link to set their password. By default the link
            expires after one hour.
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={onSubmit}
          noValidate
          aria-busy={isSubmitting}
          className="px-4 pb-6"
        >
          <FieldGroup>
            <FormRootError message={errors.root?.server?.message} />
            <FormTextField
              control={form.control}
              name="fullName"
              label="Full name"
              autoComplete="off"
              size="lg"
              required
            />
            <FormTextField
              control={form.control}
              name="email"
              label="Work email"
              type="email"
              inputMode="email"
              autoComplete="off"
              icon={MailIcon}
              size="lg"
              required
            />
            <FormTextField
              control={form.control}
              name="jobTitle"
              label="Job title"
              description="Optional. For example: Senior nursing officer."
              autoComplete="off"
              size="lg"
            />
            <FormSelectField
              control={form.control}
              name="roleId"
              label="Role"
              options={roles}
              placeholder="Choose a role"
              description="Decides what they can see and do. Roles other than Administrator are provisional."
              required
            />
            <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
              {isSubmitting && <Loader2Icon className="animate-spin" aria-hidden />}
              {isSubmitting ? "Sending invitation…" : "Send invitation"}
            </Button>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  );
}
