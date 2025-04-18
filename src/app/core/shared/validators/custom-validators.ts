import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

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
  },
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup): ValidationErrors | null => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (!control || !matchingControl) {
        return null;
      }

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return null;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        return { mustMatch: true };
      } else {
        matchingControl.setErrors(null);
        return null;
      }
    };
  }
};