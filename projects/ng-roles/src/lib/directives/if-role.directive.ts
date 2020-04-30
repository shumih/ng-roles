import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Directive,
  EmbeddedViewRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ROLES_STREAM_TOKEN } from '../tokens';
import { intersect, toArray } from '../helpers/collection';

interface ShRoleContext {
  roles: string[];
}

@Directive({
  selector: '[shRoleIf]',
})
export class IfRoleDirective<C extends string> implements OnInit, OnDestroy {
  @Input()
  set shRoleIf(value: C | C[]) {
    const roles = toArray(value);

    this.contextSubject.next({ roles });
  }

  @Input()
  set vtbRoleIfThen(templateRef: TemplateRef<ShRoleContext> | null) {
    this.thenTemplateRef = templateRef!;
    this.thenViewRef = null;

    this.forceUpdate();
  }

  @Input()
  set vtbRoleIfElse(templateRef: TemplateRef<ShRoleContext> | null) {
    this.elseTemplateRef = templateRef;
    this.elseViewRef = null;

    this.forceUpdate();
  }

  private elseTemplateRef: TemplateRef<ShRoleContext> | null = null;

  private thenViewRef: EmbeddedViewRef<ShRoleContext> | null = null;
  private elseViewRef: EmbeddedViewRef<ShRoleContext> | null = null;

  private contextSubject: BehaviorSubject<ShRoleContext> = new BehaviorSubject({ roles: [] });
  private destroy$: Subject<void> = new Subject();

  constructor(
    private vcRef: ViewContainerRef,
    private thenTemplateRef: TemplateRef<ShRoleContext>,
    @Inject(ROLES_STREAM_TOKEN) private roles$: Observable<C[]>
  ) {}

  ngOnInit(): void {
    combineLatest([this.roles$, this.contextSubject])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([roles, context]) => this.update(roles, context));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private forceUpdate(): void {
    this.contextSubject.next(this.contextSubject.value);
  }

  private update(customerRoles: C[], context: ShRoleContext): void {
    const shouldShow = intersect(customerRoles, context.roles).length > 0;

    if (shouldShow && !this.thenViewRef && this.thenTemplateRef) {
      this.vcRef.clear();
      this.elseViewRef = null;

      this.thenViewRef = this.vcRef.createEmbeddedView(this.thenTemplateRef, context);
      this.thenViewRef.detectChanges();
    }

    if (!shouldShow && !this.elseViewRef) {
      this.thenViewRef = null;
      this.vcRef.clear();

      if (this.elseTemplateRef) {
        this.elseViewRef = this.vcRef.createEmbeddedView(this.elseTemplateRef, context);
        this.elseViewRef.detectChanges();
      }
    }
  }
}
