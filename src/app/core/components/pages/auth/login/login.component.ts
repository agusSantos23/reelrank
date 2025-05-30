import { Component, inject } from '@angular/core';
import { DataLink, TitleLinkComponent } from "../../../ui/title-link/title-link.component";
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { FloatingLabelDirective } from '../../../../shared/directives/animations/floating-label/floating-label.directive';
import { FocusInputDirective } from '../../../../shared/directives/functionality/focus-input/focus-input.directive';
import { Router } from '@angular/router';
import { InfoInputComponent } from "../../../inputs/info-input/info-input.component";
import { ViewInputComponent } from "../../../inputs/view-input/view-input.component";
import { AuthService } from '../../../../services/auth/auth.service';
import { NotificationService } from '../../../../services/notification/notification.service';

@Component({
  selector: 'app-login',
  imports: [
    TitleLinkComponent,
    ReactiveFormsModule,
    FloatingLabelDirective,
    FocusInputDirective,
    InfoInputComponent,
    ViewInputComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  protected form = new FormGroup({
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
  

  protected validationErrors: any = {};
  protected generalErrors: string[] = [];
  protected viewPassword = false;
  protected dataLink: DataLink = {
    name: "register",
    link: "auth/register"
  }

  protected infoInputs = {
    "email": [
      "Provide a valid email address (user@example.com)"
    ],
    "password": [
      "Must be at least 8 characters",
      "Must be no more than 64 characters",
      "Must contain at least one uppercase letter",
      "Must contain at least one lowercase letter",
      "Must contain at least one special character"
    ]
  };

  

  protected onSubmit() {

    if (this.form && this.form.valid) {

      this.authService.login(this.form.value).subscribe({
        next: () => {
          this.notificationService.show({
            type: 'timeline',
            isError: false,
            text: 'Redirecting to the main page...',
            position: 'tr',
            duration: 3000
          });          

          setTimeout(() => {
            this.router.navigate(['']); 
          }, 3000);
        },
        error: (error) => {
          if (error.status === 422 || error.status === 401) {
            
            this.generalErrors = []; 
            this.generalErrors.push(error.error.error);
            
            this.notificationService.show({
              type: 'text',
              isError: true,
              text: 'Error logging in',
              position: 'tr',
              duration: 5000
            })

          } else {
            console.error('Error:', error);
          }
        }
      })

    } else {
      this.form.markAllAsTouched()
      
    }
  }

  protected onCancel() {
    this.router.navigate(['']);
  }
}
