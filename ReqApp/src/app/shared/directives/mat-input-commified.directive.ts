import {Directive, ElementRef, forwardRef, HostListener, Input} from '@angular/core';
import {MAT_INPUT_VALUE_ACCESSOR} from '@angular/material';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {numberWithCommas} from './helpers';

@Directive({
  selector: 'input[matInputCommified]',
  providers: [
    {provide: MAT_INPUT_VALUE_ACCESSOR, useExisting: MatInputCommifiedDirective}
})
export class MatInputCommifiedDirective {

  private _value: string | null;

  constructor(private elementRef: ElementRef<HTMLInputElement>,
  ) {}


  get value(): string | null {
    return this._value;
  }

  @Input('value')
  set value(value: string | null) {
    this._value = value;
    this.formatValue(value);
  }

  private formatValue(value: string | null) {
    if (value !== null) { 
      this.elementRef.nativeElement.value = numberWithCommas(value);
    } else {
      this.elementRef.nativeElement.value = '';
    }
  }


}