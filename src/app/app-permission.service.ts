import { Injectable } from '@angular/core';
import { PermissionService } from '../../projects/ng-roles/src/lib/services/permission.service';
import { PermissionMap } from '../../projects/ng-roles/src/lib/models/permission.interface';
import { Observable, of } from 'rxjs';

type RoleCode = 'user' | 'admin';

@Injectable({
  providedIn: 'root',
})
export class AppPermissionService extends PermissionService {
  public roleToAllowedSections: PermissionMap<RoleCode, string> = {
    admin: ['home', { public: ['place'] }, { secure: ['place'] }],
    user: ['home', { public: ['place'] }],
  };
  public roles$: Observable<RoleCode[]> = of(['user']);
}
