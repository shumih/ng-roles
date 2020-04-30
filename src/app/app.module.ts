import '@angular/compiler';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NgRolesModule } from '../../projects/ng-roles/src/lib/ng-roles.module';
import { AppComponent } from './app.component';
import { SimpleRouteComponent } from './simple-route/simple-route.component';
import { RoleGuard } from '../../projects/ng-roles/src/lib/guards/role.guard';
import { PermissionService } from '../../projects/ng-roles/src/lib/services/permission.service';
import { AppPermissionService } from './app-permission.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: SimpleRouteComponent,
    data: { title: "That's home" },
  },
  {
    path: 'public',
    canActivateChild: [RoleGuard],
    children: [
      {
        path: 'place',
        component: SimpleRouteComponent,
        data: { title: "That's public place" },
      },
    ],
  },
  {
    path: 'secure',
    canActivateChild: [RoleGuard],
    children: [
      {
        path: 'place',
        component: SimpleRouteComponent,
        data: { title: "That's secure place" },
      },
    ],
  },
];

@NgModule({
  declarations: [AppComponent, SimpleRouteComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    NgRolesModule.forRoot([['/home'], { queryParams: { message: 'Access denied' } }]),
  ],
  providers: [{ provide: PermissionService, useExisting: AppPermissionService }],
  bootstrap: [AppComponent],
})
export class AppModule {}
