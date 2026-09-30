import { AppError, AuthenticationError, RateLimitError } from "@/lib/errors";

/**
 * Maps a Supabase `signInWithPassword` error to a user-safe `AppError`.
 *
 * Unknown email and wrong password produce the same message so sign-in forms
 * cannot be used to discover which staff accounts exist.
 */
export function toSignInError(error: { code?: string }): AppError {
  switch (error.code) {
    case "invalid_credentials":
      return new AuthenticationError("Invalid email or password.");
    case "email_not_confirmed":
      return new AuthenticationError(
        "Please verify your email address before signing in.",
      );
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return new RateLimitError();
    default:
      // Unexpected (e.g. Auth service unavailable): logged in full by
      // runAction, reported generically to the user.
      return new AppError("INTERNAL_ERROR", "Sign-in is temporarily unavailable.", {
        cause: error,
      });
  }
}
