import { Component, inject, ViewChild } from '@angular/core';
import { DataLink, TitleAuthComponent } from "../../../ui/title-auth/title-auth.component";
import { Router } from '@angular/router';
import { AvatarsModalComponent } from "../../layout/avatars-modal/avatars-modal.component";

@Component({
  selector: 'app-register',
  imports: [TitleAuthComponent, AvatarsModalComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private router = inject(Router)

  @ViewChild('avatarsModal') avatarsModal!: AvatarsModalComponent;

  protected avatarId?: string;
  protected dataLink: DataLink = {
    name: "login",
    link: "auth/login"
  }
  protected currentPage: number = 0;

  protected onCancel() {
    this.router.navigate(['']);
  }

  protected nextPage(){
    if (this.currentPage < 2) this.currentPage++;
  }

  protected previousPage(){
    if (this.currentPage > 0) this.currentPage--;
  }

  protected viewAvatars(){
    this.avatarsModal.openModal()
  }

  protected newAvatarSelected(newAvatarId: string){

    this.avatarId = newAvatarId;

    console.log(this.avatarId);
    
  }

}
