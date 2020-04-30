import { cloneDeep, findAndReplaceIfValueIsMoreImportant } from '../helpers/permission';
import { PermissionMap, SectionValue } from '../models/permission.interface';
import { Observable } from 'rxjs';

export abstract class PermissionService<SectionCode extends string = string, RoleCode extends string = string> {
  public abstract roles$: Observable<RoleCode[]>;
  public abstract roleToAllowedSections: PermissionMap<RoleCode, SectionCode>;

  public getAllowedSections(roles: RoleCode[]): SectionValue<SectionCode>[] {
    const sectionValuesFromRoles = cloneDeep(roles.map(role => this.roleToAllowedSections[role]));

    const result = sectionValuesFromRoles.shift() ?? [];

    sectionValuesFromRoles.forEach((value: SectionValue<SectionCode>[]) => {
      findAndReplaceIfValueIsMoreImportant(result, value);
    });

    return result;
  }
}
