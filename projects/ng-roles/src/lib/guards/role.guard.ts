import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Route, Router, Routes, UrlTree } from '@angular/router';
import { DEFAULT_ROUTER_COMMANDS, SECTIONS_STREAM_TOKEN } from '../tokens';
import { SectionValue } from '../models/permission.interface';
import { canShowSections } from '../helpers/permission';
import { flat } from '../helpers/collection';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard<C extends string = string> implements CanActivateChild, CanActivate {
  constructor(
    @Optional() @Inject(DEFAULT_ROUTER_COMMANDS) private defaultCommands: Parameters<Router['navigate']>,
    @Inject(SECTIONS_STREAM_TOKEN) private allowedSections$: Observable<SectionValue<C>>,
    private router: Router
  ) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.canActivateRoute(route);
  }
  public canActivateChild(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.canActivateRoute(next);
  }

  public canActivateRoute(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const fragments = flat(next.pathFromRoot.map(path => path.url)).map(segment => segment.path);

    return this.allowedSections$.pipe(
      take(1),
      map(allowed => {
        if (this.canActivateFragments(fragments, allowed)) {
          return true;
        }
        const siblings: Routes = (next?.parent?.routeConfig?.children || []).filter(
          (s: Route) => s.redirectTo !== fragments[fragments.length - 1]
        );
        const allowedSiblingFragments = siblings
          .map(child => [...fragments.slice(0, -1), child.path!])
          .find(siblingFragments => canShowSections(allowed, siblingFragments));

        if (allowedSiblingFragments) {
          return this.router.createUrlTree(allowedSiblingFragments);
        }

        if (this.defaultCommands) {
          return this.router.createUrlTree(...this.defaultCommands);
        }

        return false;
      })
    );
  }

  public canActivateFragments<V extends SectionValue<string>>(fragments: string[], allowed: V) {
    return canShowSections(allowed, fragments);
  }
}
