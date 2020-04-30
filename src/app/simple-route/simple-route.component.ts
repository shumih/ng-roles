import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-simple-route',
  template: `
    <h1 class="title">{{ title$ | async }}</h1>
    <p class="message">{{ message$ | async }}</p>

    <ul class="sections">
      <li *ngFor="let path of paths">
        <a [routerLink]="path">GO to {{ path }}</a>
      </li>
    </ul>
  `,
  styles: [
    `
      .title {
        text-align: center;
        font-size: 24px;
        color: #1e1e1e;
        font-weight: bold;
      }

      .message {
        color: #cc0605;
      }
    `,
  ],
})
export class SimpleRouteComponent {
  public title$ = this.route.data.pipe(map(data => data.title));
  public message$ = this.route.queryParams.pipe(map(params => params.message));

  constructor(private route: ActivatedRoute) {}

  public paths = [['/home'], ['/public', 'place'], ['/secure', 'place']];
}
