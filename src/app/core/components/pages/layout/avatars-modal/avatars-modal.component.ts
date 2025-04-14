import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProfileAvatarComponent } from "../../../ui/profile-avatar/profile-avatar.component";
import { Saga } from '../../../../models/Saga.model';
import { OptionsSliderComponent } from '../../../inputs/options-slider/options-slider.component';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-avatars-modal',
  imports: [ProfileAvatarComponent, OptionsSliderComponent, TitleCasePipe],
  templateUrl: './avatars-modal.component.html',
  styleUrl: './avatars-modal.component.css',
})
export class AvatarsModalComponent implements OnInit{
  @Input() selectedAvatarId?: string;
  @Output() avatarId: EventEmitter<string> = new EventEmitter<string>()

  protected temporalAvatarId?: string;
  protected isVisible: boolean = false;
  protected newAvatar: boolean = false;
  protected sagas: Saga[] = [
    {
      name: "lord of the rings",
      avatarsIds: [
        "V06zcd4L",
        "RKGJLNg",
        "39SCQ71X",
        "GvN9mfRj",
        "bg6BR6Kd",
        "KjZ9Bz2X",
        "9kwQNCSp",
        "v6K1XgDh",
        "n4D0kPS",
        "N6W3yBkr",
        "JRBKmVh7",
        "r2VK2d6c"
      ]
    },
    {
      name: "fight club",
      avatarsIds: [
        "60PRLZ4R",
        "84D2tjF5",
        "5hL2VP00",
        "qY9z3FGm",
        "GQFsPHBH",
        "DHB5xjs3",
      ]
    }
  ]

  ngOnInit(): void {
    this.temporalAvatarId = this.selectedAvatarId;
  }


  public openModal() {
    this.temporalAvatarId = this.selectedAvatarId;
    this.newAvatar = false;
    this.isVisible = true;
  }

  public closeModal() {
    this.temporalAvatarId = this.selectedAvatarId;
    this.newAvatar = false;
    this.isVisible = false;
  }

  protected onAvatar(avatarId: any) {
    this.newAvatar = true;
    this.temporalAvatarId = avatarId;
  }

  protected confirmAvatar(){
    
    this.avatarId.emit(this.temporalAvatarId);
    this.closeModal();
  }

  protected eliminatedAvatar(){
    this.temporalAvatarId = '';
    this.newAvatar = true;
  }

}
