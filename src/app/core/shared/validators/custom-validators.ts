import { AbstractControl, ValidationErrors } from '@angular/forms';

export const CustomValidators = {
  hasUpperCase: (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null; 
    
    const hasUpper = /[A-Z]/.test(control.value);
    return hasUpper ? null : { 'noUpperCase': true };
  },
  hasLowerCase: (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const hasLower = /[a-z]/.test(control.value);
    return hasLower ? null : { 'noLowerCase': true };
  },
  hasSpecialCharacter: (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    
    const hasSpecial = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(control.value);
    return hasSpecial ? null : { 'noSpecialCharacter': true };
  }
};