import { expect, test } from "@playwright/test";

test("public start page states the project status", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "General Hospital Biu" }),
  ).toBeVisible();
  await expect(page.getByText("is not approved for clinical use")).toBeVisible();
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
