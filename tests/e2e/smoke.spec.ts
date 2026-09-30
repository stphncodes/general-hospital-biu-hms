import { expect, test } from "@playwright/test";

test("the front page is the staff sign-in", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  // The admin console is deliberately not linked from staff pages.
  await expect(page.locator('a[href^="/admin"]')).toHaveCount(0);
});

test("old /sign-in links redirect to the front page, keeping the query", async ({
  page,
}) => {
  await page.goto("/sign-in?next=%2Fdashboard");

  await expect(page).toHaveURL(/\/\?next=%2Fdashboard$/);
  await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
});

test("sign-in links to registration and password reset", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Register" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Request staff access" }),
  ).toBeVisible();

  await page.goto("/");
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Reset your password" }),
  ).toBeVisible();
});

test("password reset page requires a recovery session", async ({ page }) => {
  await page.goto("/reset-password");

  await expect(page).toHaveURL(/\/\?error=link_invalid$/);
  await expect(page.getByText("This link is invalid or has expired")).toBeVisible();
});

test("protected area redirects signed-out users to sign in", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/\?next=%2Fdashboard$/);
  await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
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
