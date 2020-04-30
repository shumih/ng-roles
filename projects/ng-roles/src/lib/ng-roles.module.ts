import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { IfRoleDirective } from './directives/if-role.directive';
import { IfSectionDirective } from './directives/if-section.directive';
import { DEFAULT_ROUTER_COMMANDS, ROLES_STREAM_TOKEN, SECTIONS_STREAM_TOKEN } from './tokens';
import { PermissionService } from './services/permission.service';

@NgModule({
  imports: [CommonModule],
  declarations: [IfRoleDirective, IfSectionDirective],
  exports: [IfRoleDirective, IfSectionDirective],
})
export class NgRolesModule {
  static forRoot(defaultRouterCommand?: Parameters<Router['navigate']>): ModuleWithProviders {
    return {
      ngModule: NgRolesModule,
      providers: [
        {
          provide: SECTIONS_STREAM_TOKEN,
          useFactory: (permissions: PermissionService) =>
            permissions.roles$.pipe(map(roles => permissions.getAllowedSections(roles))),
          deps: [PermissionService],
        },
        {
          provide: ROLES_STREAM_TOKEN,
          useFactory: (service: PermissionService) => service.roles$,
          deps: [PermissionService],
        },
        {
          provide: DEFAULT_ROUTER_COMMANDS,
          useValue: defaultRouterCommand,
        },
      ],
    };
  }
}
