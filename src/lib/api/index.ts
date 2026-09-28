// Client-safe exports only. Import `run-action` and `route-handler` directly
// from server code; they are guarded by `server-only`.
export { actionError, actionOk, type ActionResult } from "./action-result";
