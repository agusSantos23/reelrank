import { UpperCasePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ClickOutSideDirective } from '../../../shared/directives/functionality/click-out-side/click-out-side.directive';

@Component({
  selector: 'app-profile-avatar',
  imports: [UpperCasePipe, ClickOutSideDirective],
  templateUrl: './profile-avatar.component.html',
  styleUrl: './profile-avatar.component.css'
})
export class ProfileAvatarComponent {
  private authService = inject(AuthService);

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
    this.authService.logout();
    this.showModal = false;
  }

}

