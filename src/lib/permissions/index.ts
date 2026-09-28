export { PERMISSIONS, isPermission, type Permission } from "./catalog";
export type {
  PermissionGrant,
  PermissionScope,
  Principal,
  ResourceContext,
} from "./model";
export { authorize, can, hasPermissionInAnyScope } from "./check";
