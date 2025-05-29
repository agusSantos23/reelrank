import { Component, inject, ViewChild } from '@angular/core';
import { DataLink, TitleLinkComponent } from "../../../ui/title-link/title-link.component";
import { Router } from '@angular/router';
import { AvatarsModalComponent } from "../../layout/avatars-modal/avatars-modal.component";
import { AbstractControlOptions, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InfoInputComponent } from "../../../inputs/info-input/info-input.component";
import { FloatingLabelDirective } from '../../../../shared/directives/animations/floating-label/floating-label.directive';
import { FocusInputDirective } from '../../../../shared/directives/functionality/focus-input/focus-input.directive';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { ViewInputComponent } from "../../../inputs/view-input/view-input.component";
import { RegisterUser } from '../../../../models/auth/DataUser.model';
import { Avatar } from '../../../../models/Avatar.model';
import { AuthService } from '../../../../services/auth/auth.service';


@Component({
  selector: 'app-register',
  imports: [
    TitleLinkComponent,
    ReactiveFormsModule,
    AvatarsModalComponent,
    InfoInputComponent,
    FloatingLabelDirective,
    FocusInputDirective,
    ViewInputComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  @ViewChild('avatarsModal') avatarsModal!: AvatarsModalComponent;


  protected form = new FormGroup({
    avatarId: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastname: new FormControl('', [Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(64),
      CustomValidators.hasUpperCase,
      CustomValidators.hasLowerCase,
      CustomValidators.hasSpecialCharacter
    ]),
    password_confirmation: new FormControl('', [Validators.required])
  }, { validators: CustomValidators.mustMatch('password', 'password_confirmation') } as AbstractControlOptions);

  protected validationErrors: any = {};
  protected generalErrors: string[] = [];
  protected viewPassword = false;
  protected viewConfirmPassword = false;
  protected avatar?: Avatar;
  protected dataLink: DataLink = {
    name: "login",
    link: "auth/login"
  }
  protected currentPage: number = 0;

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
    ],
    "confirmPassword": [
      "Enter your password again for confirmation",
    ],
  };



  protected onSubmit() {

    if (this.form && this.form.valid) {
      const userData: RegisterUser = {
        avatarId: this.form.value.avatarId ?? undefined,
        name: this.form.value.name || '',
        lastname: this.form.value.lastname || '',
        email: this.form.value.email || '',
        password: this.form.value.password || '',
        password_confirmation: this.form.value.password_confirmation || ''
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          if (error.status === 422) {
            this.validationErrors = error.error.errors;
            this.generalErrors = []; 
            for (const field in this.validationErrors) {
              this.generalErrors.push(...this.validationErrors[field]);
            }
          } else {
            console.error('Error:', error);
          }
        }
      });
    } else {
      console.error('Invalid form');

      if (this.form.get('name')?.invalid || this.form.get('lastname')?.invalid) {
        this.currentPage = 0;
      } else if (this.form.get('email')?.invalid || this.form.get('password')?.invalid || this.form.get('confirmPassword')?.invalid) {
        this.currentPage = 1;
      }

      this.form.markAllAsTouched()

    }

  }

  protected onCancel() {
    this.router.navigate(['']);
  }

  protected nextPage() {
    if (this.currentPage < 2) this.currentPage++;
  }

  protected previousPage() {
    if (this.currentPage > 0) this.currentPage--;
  }

  protected viewAvatars() {
    this.avatarsModal.openModal()
  }

  protected newAvatarSelected(newAvatar: Avatar) {
    this.avatar = newAvatar;    

    this.form.patchValue({ avatarId: newAvatar.id });
    
  }


}
