import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

export type AlertType = 'error' | 'warning' | 'success' | 'info';

@Component({
    selector: 'app-alert-message',
    imports: [MatIconModule, NgClass],
    templateUrl: './alert-message.component.html',
    styleUrl: './alert-message.component.scss'
})
export class AlertMessageComponent {
  readonly message = input.required<string>();
  readonly type = input.required<AlertType>();
}
