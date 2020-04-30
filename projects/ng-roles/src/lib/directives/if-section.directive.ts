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
import { SECTIONS_STREAM_TOKEN } from '../tokens';
import { SectionValue } from '../models/permission.interface';
import { canShowSections } from '../helpers/permission';

interface ShSectionContext {
  config: string[][];
}

@Directive({
  selector: '[shSectionIf]',
})
export class IfSectionDirective<C extends string> implements OnInit, OnDestroy {
  @Input()
  set shSectionIf(value: string[] | string[][]) {
    let context: ShSectionContext;
    if (this.isArrayOfArrays(value)) {
      context = { config: value.slice() };
    } else {
      context = { config: [value.slice()] };
    }

    this.contextSubject.next(context);
  }

  @Input()
  set vtbSectionIfThen(templateRef: TemplateRef<ShSectionContext> | null) {
    this.thenTemplateRef = templateRef!;
    this.thenViewRef = null;

    this.forceUpdate();
  }

  @Input()
  set vtbSectionIfElse(templateRef: TemplateRef<ShSectionContext> | null) {
    this.elseTemplateRef = templateRef;
    this.elseViewRef = null;

    this.forceUpdate();
  }

  private elseTemplateRef: TemplateRef<ShSectionContext> | null = null;

  private thenViewRef: EmbeddedViewRef<ShSectionContext> | null = null;
  private elseViewRef: EmbeddedViewRef<ShSectionContext> | null = null;

  private contextSubject: BehaviorSubject<ShSectionContext> = new BehaviorSubject({ config: [] });
  private destroy$: Subject<void> = new Subject();

  constructor(
    private vcRef: ViewContainerRef,
    private thenTemplateRef: TemplateRef<ShSectionContext>,
    @Inject(SECTIONS_STREAM_TOKEN) private allowedSections$: Observable<SectionValue<C>>
  ) {}

  ngOnInit(): void {
    combineLatest([this.allowedSections$, this.contextSubject])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([sections, context]) => this.update(sections, context));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private forceUpdate(): void {
    this.contextSubject.next(this.contextSubject.value);
  }

  private update(sections: SectionValue<C>, context: ShSectionContext): void {
    const shouldShow = context.config.some(paths => canShowSections(sections, paths));

    if (shouldShow && !this.thenViewRef && this.thenTemplateRef) {
      this.vcRef.clear();
      this.elseViewRef = null;

      this.thenViewRef = this.vcRef.createEmbeddedView(this.thenTemplateRef);
      this.thenViewRef.detectChanges();
    }

    if (!shouldShow && !this.elseViewRef) {
      this.thenViewRef = null;
      this.vcRef.clear();

      if (this.elseTemplateRef) {
        this.elseViewRef = this.vcRef.createEmbeddedView(this.elseTemplateRef);
        this.elseViewRef.detectChanges();
      }
    }
  }

  private isArrayOfArrays<T>(value: T[] | T[][]): value is T[][] {
    return Array.isArray(value) && Array.isArray(value[0]);
  }
}
