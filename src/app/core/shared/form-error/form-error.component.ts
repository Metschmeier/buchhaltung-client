import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-error.component.html',
})
export class FormErrorComponent {
  @Input() control!: AbstractControl;
  @Input() errorKey!: string;
  @Input() message!: string;

  get showError(): boolean {
    return this.control.hasError(this.errorKey) && (this.control.touched || this.control.dirty);
  }
}