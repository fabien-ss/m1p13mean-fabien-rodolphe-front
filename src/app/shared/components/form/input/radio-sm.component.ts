import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-radio-sm',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioSmComponent),
      multi: true
    }
  ],
  template: `
    <label
      [attr.for]="id"
      [ngClass]="'flex cursor-pointer select-none items-center text-sm text-gray-500 dark:text-gray-400 ' + className"
    >
      <span class="relative">
        <input
          type="radio"
          [id]="id"
          [name]="name"
          [value]="value"
          [checked]="isChecked"
          (change)="handleChange()"
          (blur)="onTouched()"
          class="sr-only"
        />
        <span
          [ngClass]="
            'mr-2 flex h-4 w-4 items-center justify-center rounded-full border ' +
            (isChecked
              ? 'border-brand-500 bg-brand-500'
              : 'bg-transparent border-gray-300 dark:border-gray-700')
          "
        >
          <span
            [ngClass]="
              'h-1.5 w-1.5 rounded-full ' +
              (isChecked ? 'bg-white' : 'bg-white dark:bg-[#1e2636]')
            "
          ></span>
        </span>
      </span>
      {{ label }}
    </label>
  `,
})
export class RadioSmComponent implements ControlValueAccessor {

  @Input() id!: string;
  @Input() name!: string;
  @Input() value!: string;
  @Input() label!: string;
  @Input() className: string = '';

  modelValue: string = '';

  get isChecked(): boolean {
    return this.modelValue === this.value;
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(val: string): void {
    this.modelValue = val ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {}

  handleChange() {
    this.modelValue = this.value;
    this.onChange(this.value);
    this.onTouched();
  }
}