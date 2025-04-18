import { UpperCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-profile-avatar',
  imports: [UpperCasePipe],
  templateUrl: './profile-avatar.component.html',
  styleUrl: './profile-avatar.component.css'
})
export class ProfileAvatarComponent {
  @Input() posterUrl?: string;
  @Input() name?: string;
  @Input() isRemovable: boolean = false;
  @Output() isEliminated = new EventEmitter()


  protected remove(): void{

    if (this.isRemovable && this.posterUrl) {
      this.isEliminated.emit();
      this.posterUrl = undefined;
    }
  }

}

