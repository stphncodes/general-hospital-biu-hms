import { expect, test } from "@playwright/test";

test("public start page shows the project and its independence", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByText("not affiliated with, endorsed by or operated"),
  ).toBeVisible();
});

test("public header links to sign in and registration", async ({ page }) => {
  await page.goto("/");
  const account = page.getByRole("navigation", { name: "Account" });

  await account.getByRole("link", { name: "Register" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Request staff access" }),
  ).toBeVisible();

  await page.goto("/");
  await account.getByRole("link", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Reset your password" }),
  ).toBeVisible();
});

test("password reset page requires a recovery session", async ({ page }) => {
  await page.goto("/reset-password");

  await expect(page).toHaveURL(/\/sign-in\?error=link_invalid$/);
  await expect(page.getByText("This link is invalid or has expired")).toBeVisible();
});

test("protected area redirects signed-out users to sign in", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/sign-in\?next=%2Fdashboard$/);
  await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});

test("health endpoint responds without authentication", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ status: "ok" });
});

test("admin console sends signed-out visitors to the admin sign-in", async ({ page }) => {
  await page.goto("/admin/staff");

  await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin%2Fstaff$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Administrator sign in" }),
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
});
