import { Component, ElementRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NotificationData } from '../../../models/Notification.model';
import { interval, Subject, takeUntil } from 'rxjs';
import { state, style, trigger } from '@angular/animations';
import { NotificationService } from '../../../services/notification/notification.service';
import { WrapperComponent } from "../wrapper/wrapper.component";

@Component({
  selector: 'app-notification',
  imports: [WrapperComponent],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  animations: [
    trigger('notificationAnimation', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private elementRef = inject(ElementRef);

  @Input() notification!: NotificationData;
  @Input() index!: number; 
  @Output() closed = new EventEmitter<string>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  @ViewChild('notificationInner', { read: ElementRef }) notificationInner!: ElementRef;

  protected animationState: 'void' | '*' = 'void';
  protected timelineProgress = 0;

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    
    this.animationState = '*';


    this.notificationService.notifications$.pipe(takeUntil(this.destroy$)).subscribe(notifications => {
      this.index = notifications.findIndex(n => n.data.id === this.notification.id);      

    });

    if (this.notification.type === 'timeline' && this.notification.duration) {
      interval(this.notification.duration / 100)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.timelineProgress += 1;

          if (this.timelineProgress >= 100) this.close();

        });

    } else if (this.notification.duration) {
      setTimeout(() => {
        this.close();

      }, this.notification.duration);
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public close(): void {
    this.animationState = 'void';
  }

  public onAnimationDone(event: any): void {
    if (event.toState === 'void') this.closed.emit(this.notification.id);

  }

  public confirm(): void {
    this.confirmed.emit();
    this.close();
  }

  public cancel(): void {
    this.cancelled.emit();
    this.close();
  }





}