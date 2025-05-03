import { Injectable, ApplicationRef, createComponent, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationData } from '../../models/Notification.model';
import { NotificationComponent } from '../../components/ui/notification/notification.component';
import { v4 as uuidv4 } from 'uuid';
interface NotificationInstance {
  componentRef: any;
  data: NotificationData;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private appRef = inject(ApplicationRef)

  private notificationSubject = new BehaviorSubject<NotificationInstance[]>([]);
  notifications$ = this.notificationSubject.asObservable();

  show(notification: Omit<NotificationData, 'id'>): void {
    
    const id = uuidv4();
    const notificationData: NotificationData = { ...notification, id };
    
    const componentRef = createComponent(NotificationComponent, { environmentInjector: this.appRef.injector });

    componentRef.instance.notification = notificationData;

    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(componentRef.location.nativeElement);
    
    const currentNotifications = this.notificationSubject.getValue();
    this.notificationSubject.next([...currentNotifications, { componentRef, data: notificationData }]);

    componentRef.instance.closed.subscribe((closedId) => this.remove(closedId));

    if (notificationData.type === 'confirmation') {
      componentRef.instance.confirmed.subscribe(() => notificationData.onConfirm?.() );

      componentRef.instance.cancelled.subscribe(() => notificationData.onCancel?.() );
    }
  }

  remove(id: string): void {
    
    const currentNotifications = this.notificationSubject.getValue();
    const notificationToRemove = currentNotifications.find(n => n.data.id === id);

    if (notificationToRemove) {
      this.appRef.detachView(notificationToRemove.componentRef.hostView);
      notificationToRemove.componentRef.destroy();

      this.notificationSubject.next(currentNotifications.filter(n => n.data.id !== id));
    }
  }



}