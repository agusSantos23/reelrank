import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { filter, Subscription, take } from 'rxjs';
import { BasicUser } from '../../../models/auth/DataUser.model';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);

  private userSubscription?: Subscription;

  protected user: BasicUser | null = null;
  

  ngOnInit(): void {

    this.loadDataUser();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) this.userSubscription.unsubscribe();

  }

  private loadDataUser() {
    this.userService.getUser();

    this.userSubscription = this.userService.currentUser$
      .pipe(
        filter((currentUser) => currentUser !== null),
        take(1)
      )
      .subscribe((currentUser) => {
        this.user = currentUser;

        if (this.user?.status === 'blocked') {

          //-----------------
        }

        
        this.userService.statisticsUser();

        console.log(this.user);
        
      });


    
  }
}
