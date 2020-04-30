import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .content {
        min-height: 320px;
        margin: 20% auto;
      }
    `,
  ],
})
export class AppComponent {}
