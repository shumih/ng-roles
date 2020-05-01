# NgRoles

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.7.

## Installation

Run `npm i @shumih/ng-roles` to install package.

## Usage

requires service extended from PermissionService\
requires import with providers in root module
 
```javascript
@NgModule({
  imports: [
    NgRolesModule.forRoot([['/home'], { queryParams: { message: 'Access denied' } }]),
  ],
  providers: [{ provide: PermissionService, useExisting: AppPermissionService }],
})
```

requires import in submodules where you want to use related directives

```javascript
@NgModule({
  imports: [
    NgRolesModule,
  ],
})
```
