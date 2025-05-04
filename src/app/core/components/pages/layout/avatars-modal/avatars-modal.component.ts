import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ProfileAvatarComponent } from "../../../ui/profile-avatar/profile-avatar.component";
import { Saga } from '../../../../models/Saga.model';
import { OptionsSliderComponent } from '../../../inputs/options-slider/options-slider.component';
import { TitleCasePipe } from '@angular/common';
import { SagaService } from '../../../../services/saga/saga.service';
import { Avatar } from '../../../../models/Avatar.model';
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-avatars-modal',
  imports: [ProfileAvatarComponent, OptionsSliderComponent, TitleCasePipe, ModalComponent],
  templateUrl: './avatars-modal.component.html',
  styleUrl: './avatars-modal.component.css',
})
export class AvatarsModalComponent implements OnInit {
  private sagaService = inject(SagaService);

  @Input() selectedAvatar?: Avatar;
  @Output() avatar: EventEmitter<Avatar> = new EventEmitter<Avatar>()

  protected temporalAvatar?: Avatar;
  protected isVisible: boolean = false;
  protected newAvatar: boolean = false;
  protected sagas: Saga[] = []

  ngOnInit(): void {
    
    this.temporalAvatar = this.selectedAvatar;

    this.sagaService.getSagas().subscribe({
      next: (sagas) => {
        this.sagas = sagas;    
        
      },
      error: (error) => {
        console.error('Error loading the sagas:', error);
      }
    });
  }


  public openModal() {
    this.temporalAvatar = this.selectedAvatar;
    this.newAvatar = false;
    this.isVisible = true;
  }

  public closeModal() {
    this.temporalAvatar = this.selectedAvatar;
    this.newAvatar = false;
    this.isVisible = false;
  }

  protected onAvatar(avatar: any) {
    this.newAvatar = true;
    this.temporalAvatar = avatar;
  }

  protected confirmAvatar() {

    this.avatar.emit(this.temporalAvatar);
    this.closeModal();
  }

  protected eliminatedAvatar() {
    this.temporalAvatar = undefined;
    this.newAvatar = true;
  }

}
