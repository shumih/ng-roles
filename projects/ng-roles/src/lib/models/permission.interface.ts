export type SectionValue<S extends string> = { [key in S]?: Array<SectionValue<S | string>> } | S;
export type PermissionMap<R extends string, S extends string> = Record<R, Array<SectionValue<S>>>;

export interface UserPermission<UserPermissionCode extends string> {
  permission_id: number;
  permission_code: UserPermissionCode;
}
