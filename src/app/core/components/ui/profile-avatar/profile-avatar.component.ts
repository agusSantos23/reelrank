import { UpperCasePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ClickOutSideDirective } from '../../../shared/directives/functionality/click-out-side/click-out-side.directive';
import { NotificationService } from '../../../services/notification/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-profile-avatar',
  imports: [UpperCasePipe, ClickOutSideDirective],
  templateUrl: './profile-avatar.component.html',
  styleUrl: './profile-avatar.component.css',
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ProfileAvatarComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  @Input() posterUrl?: string;
  @Input() name?: string;
  @Input() isRemovable: boolean = false;
  @Input() isMenu: boolean = false;
  @Output() isEliminated = new EventEmitter()

  @ViewChild('profileContainer') profileContainer!: ElementRef;
  @ViewChild('dropdownModal') dropdownModal!: ElementRef;

  protected showModal: boolean = false;

  protected onClick(): void{
    
    if (this.isRemovable && this.posterUrl && !this.isMenu) {
      this.isEliminated.emit();
      this.posterUrl = undefined;

    }else if(this.isMenu && !this.isRemovable){
      this.showModal = !this.showModal;
      
    }
  }

  protected closeModal(): void{
    this.showModal = false;
  }

  protected logout(): void{    
    try {
      this.authService.logout();
      this.showModal = false;

      this.notificationService.show({
        type: 'text',
        isError: false,
        text: 'The session has been successfully closed.',
        position: 'tr',
        duration: 5000
      })

    } catch (error) {
      this.notificationService.show({
        type: 'text',
        isError: true,
        text: 'Error logging out',
        position: 'tr',
        duration: 5000
      })
    }
    
  }

}

