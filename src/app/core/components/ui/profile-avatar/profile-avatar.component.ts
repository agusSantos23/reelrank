import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-profile-avatar',
  imports: [UpperCasePipe],
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

  protected showModal: boolean = false;

  protected onClick(): void{
    
    if (this.isRemovable && this.posterUrl && !this.isMenu) {
      this.isEliminated.emit();
      this.posterUrl = undefined;

    }else if(this.isMenu && !this.isRemovable){
      this.showModal = !this.showModal;
      
    }
  }

  protected logout(): void{
    console.log(0);
    
    this.authService.logout();
  }

}

