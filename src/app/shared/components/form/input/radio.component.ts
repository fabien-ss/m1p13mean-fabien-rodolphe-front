import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ],
  template: `
    <label
      [attr.for]="id"
      [ngClass]="
        'relative flex cursor-pointer select-none items-center gap-3 text-sm font-medium ' +
        (disabled
          ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          : 'text-gray-700 dark:text-gray-400') +
        ' ' + className
      "
    >
      <input
        [id]="id"
        [name]="name"
        type="radio"
        [value]="value"
        [checked]="isChecked"
        (change)="handleChange()"
        (blur)="onTouched()"
        class="sr-only"
        [disabled]="disabled"
      />
      <span
        [ngClass]="
          'flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] ' +
          (isChecked
            ? 'border-brand-500 bg-brand-500'
            : 'bg-transparent border-gray-300 dark:border-gray-700') +
          ' ' +
          (disabled ? 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700' : '')
        "
      >
        <span [ngClass]="'h-2 w-2 rounded-full bg-white ' + (isChecked ? 'block' : 'hidden')"></span>
      </span>
      {{ label }}
    </label>
  `,
})
export class RadioComponent implements ControlValueAccessor {

  @Input() id!: string;
  @Input() name!: string;
  @Input() value!: string;
  @Input() label!: string;
  @Input() className: string = '';
  @Input() disabled: boolean = false;

  modelValue: string = '';

  get isChecked(): boolean {
    return this.modelValue === this.value;
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  // ControlValueAccessor
  writeValue(val: string): void {
    this.modelValue = val ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleChange() {
    if (!this.disabled) {
      this.modelValue = this.value;
      this.onChange(this.value); // 👈 notifie ngModel
      this.onTouched();
    }
  }
}