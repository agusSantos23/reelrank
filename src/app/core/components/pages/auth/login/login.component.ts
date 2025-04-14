import { Component, inject } from '@angular/core';
import { DataLink, TitleAuthComponent } from "../../../ui/title-auth/title-auth.component";
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { FloatingLabelDirective } from '../../../../shared/directives/animations/floating-label/floating-label.directive';
import { FocusInputDirective } from '../../../../shared/directives/functionality/focus-input/focus-input.directive';
import { Router } from '@angular/router';
import { InfoInputComponent } from "../../../inputs/info-input/info-input.component";

@Component({
  selector: 'app-login',
  imports: [
    TitleAuthComponent,
    ReactiveFormsModule,
    FloatingLabelDirective,
    FocusInputDirective,
    InfoInputComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(64),
      CustomValidators.hasUpperCase,
      CustomValidators.hasLowerCase,
      CustomValidators.hasSpecialCharacter
    ]),
  });
  

  protected dataLink: DataLink = {
    name: "register",
    link: "auth/register"
  }

  protected infoInputs = {
    "email": [
      "Provide a valid email address (user@example.com)"
    ],
    "password": [
      "Must be at least 8 characters.",
      "Must be no more than 64 characters.",
      "Must contain at least one uppercase letter.",
      "Must contain at least one lowercase letter.",
      "Must contain at least one special character."
    ]
  };


  

  protected onSubmit() {
    if (this.form && this.form.valid) {
      console.log('Formulario válido:', this.form.value);
    } else {
      console.log('Formulario inválido');

      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  protected onCancel() {
    this.router.navigate(['']);
  }
}
