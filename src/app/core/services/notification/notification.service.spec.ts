import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ApplicationRef, EnvironmentInjector, EventEmitter, Injector, ChangeDetectorRef, Type } from '@angular/core';
import * as AngularCore from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import { NotificationComponent } from '../../components/ui/notification/notification.component';
import { NotificationData } from '../../models/Notification.model';

class MockNotificationComponent {
  notification: NotificationData | undefined;
  index: number = 0;
  closed = new EventEmitter<string>();
  confirmed = new EventEmitter<void>();
  cancelled = new EventEmitter<void>();

  location = {
    nativeElement: document.createElement('div')
  };
  hostView: any = {
    rootNodes: [],
    onDestroy: new Observable(observer => {})
  };
  destroy = jasmine.createSpy('destroy');
}

describe('NotificationService', () => {
  let service: NotificationService;
  let appRefSpy: jasmine.SpyObj<ApplicationRef>;
  let createComponentSpy: jasmine.Spy;
  let appendChildSpy: jasmine.Spy;
  let removeChildSpy: jasmine.Spy;
  let mockComponentRefInstance: MockNotificationComponent;
  let environmentInjector: EnvironmentInjector;

  beforeEach(() => {
    mockComponentRefInstance = new MockNotificationComponent();

    appRefSpy = jasmine.createSpyObj('ApplicationRef', ['attachView', 'detachView', 'ngDoBootstrap']);

    createComponentSpy = spyOn(AngularCore, 'createComponent').and.returnValue({
      instance: mockComponentRefInstance,
      hostView: mockComponentRefInstance.hostView,
      location: mockComponentRefInstance.location,
      destroy: mockComponentRefInstance.destroy,
      setInput: jasmine.createSpy('setInput'),
      injector: {} as Injector,
      changeDetectorRef: {} as ChangeDetectorRef,
      componentType: NotificationComponent as Type<any>,
      onDestroy: jasmine.createSpy('onDestroy')
    });

    appendChildSpy = spyOn(document.body, 'appendChild');
    removeChildSpy = spyOn(document.body, 'removeChild');

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: ApplicationRef, useValue: appRefSpy },
      ]
    });
    service = TestBed.inject(NotificationService);
    environmentInjector = TestBed.inject(EnvironmentInjector);
  });

  afterEach(() => {
    if (mockComponentRefInstance.location.nativeElement.parentNode) {
      document.body.removeChild(mockComponentRefInstance.location.nativeElement);
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    const testNotificationData = {
      message: 'Test message',
      type: 'text' as const,
      isError: false,
      text: 'This is test content.',
      position: 'tr' as const
    };

    it('should create and attach a notification component', fakeAsync(() => {
      let generatedId: string = '';
      service.notifications$.subscribe(n => {
        if (n.length > 0) {
          generatedId = n[0].data.id;
        }
      }).unsubscribe();

      service.show(testNotificationData);
      tick();

      expect(createComponentSpy).toHaveBeenCalledWith(NotificationComponent, {
        environmentInjector: environmentInjector
      });
      expect(mockComponentRefInstance.notification).toEqual({ ...testNotificationData, id: generatedId, index: 0 });
      expect(mockComponentRefInstance.index).toBe(0);
      expect(appRefSpy.attachView).toHaveBeenCalledWith(mockComponentRefInstance.hostView);
      expect(appendChildSpy).toHaveBeenCalledWith(mockComponentRefInstance.location.nativeElement);

      let notifications: any[] = [];
      service.notifications$.subscribe(n => notifications = n);
      expect(notifications.length).toBe(1);
      expect(notifications[0].data.id).toBe(generatedId);
    }));

    it('should assign correct index for multiple notifications', fakeAsync(() => {
      let generatedId1: string = '';
      let generatedId2: string = '';

      service.notifications$.subscribe(n => {
        if (n.length > 0) {
          generatedId1 = n[0].data.id;
        }
        if (n.length > 1) {
          generatedId2 = n[1].data.id;
        }
      }).unsubscribe();

      service.show(testNotificationData);
      tick();
      service.show(testNotificationData);
      tick();

      let notifications: any[] = [];
      service.notifications$.subscribe(n => notifications = n);
      expect(notifications.length).toBe(2);
      expect(notifications[0].data.index).toBe(0);
      expect(notifications[1].data.index).toBe(1);
      expect(notifications[0].data.id).toBe(generatedId1);
      expect(notifications[1].data.id).toBe(generatedId2);
    }));

    it('should subscribe to component closed event and remove notification', fakeAsync(() => {
      let generatedId: string = '';
      service.notifications$.subscribe(n => {
        if (n.length > 0) {
          generatedId = n[0].data.id;
        }
      }).unsubscribe();

      service.show(testNotificationData);
      tick();

      let notifications: any[] = [];
      service.notifications$.subscribe(n => notifications = n);
      expect(notifications.length).toBe(1);

      mockComponentRefInstance.closed.emit(generatedId);
      tick();

      expect(appRefSpy.detachView).toHaveBeenCalledWith(mockComponentRefInstance.hostView);
      expect(mockComponentRefInstance.destroy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockComponentRefInstance.location.nativeElement);
      expect(notifications.length).toBe(0);
    }));

    it('should call onConfirm for confirmation type notification when confirmed', fakeAsync(() => {
      const onConfirmSpy = jasmine.createSpy('onConfirm');
      const confirmationNotification = {
        message: 'Confirm this?',
        type: 'confirmation' as const,
        onConfirm: onConfirmSpy,
        isError: false,
        text: 'Confirmation text',
        position: 'tr' as const
      };

      service.show(confirmationNotification);
      tick();

      expect(onConfirmSpy).not.toHaveBeenCalled();
      mockComponentRefInstance.confirmed.emit();
      tick();
      expect(onConfirmSpy).toHaveBeenCalled();
    }));

    it('should call onCancel for confirmation type notification when cancelled', fakeAsync(() => {
      const onCancelSpy = jasmine.createSpy('onCancel');
      const confirmationNotification = {
        message: 'Cancel this?',
        type: 'confirmation' as const,
        onCancel: onCancelSpy,
        isError: false,
        text: 'Cancellation text',
        position: 'tr' as const
      };

      service.show(confirmationNotification);
      tick();

      expect(onCancelSpy).not.toHaveBeenCalled();
      mockComponentRefInstance.cancelled.emit();
      tick();
      expect(onCancelSpy).toHaveBeenCalled();
    }));

    it('should not subscribe to confirmation events if not confirmation type', fakeAsync(() => {
      const onConfirmSpy = jasmine.createSpy('onConfirm');
      const onCancelSpy = jasmine.createSpy('onCancel');
      const infoNotification = {
        message: 'Just info',
        type: 'text' as const,
        onConfirm: onConfirmSpy,
        onCancel: onCancelSpy,
        isError: false,
        text: 'Info text without confirmation',
        position: 'tl' as const
      };

      service.show(infoNotification);
      tick();

      mockComponentRefInstance.confirmed.emit();
      mockComponentRefInstance.cancelled.emit();
      tick();

      expect(onConfirmSpy).not.toHaveBeenCalled();
      expect(onCancelSpy).not.toHaveBeenCalled();
    }));
  });

  describe('remove', () => {
    const testNotificationData = {
      message: 'Notification to remove',
      type: 'text' as const,
      isError: false,
      text: 'Removal test text',
      position: 'br' as const
    };
    let generatedId: string;

    beforeEach(fakeAsync(() => {
      service.show(testNotificationData);
      tick();
      let notifications: any[] = [];
      service.notifications$.subscribe(n => {
        notifications = n;
        if (n.length > 0) {
          generatedId = n[0].data.id;
        }
      });
      expect(notifications.length).toBe(1);
    }));

    it('should detach view, destroy component, and remove from subject', fakeAsync(() => {
      service.remove(generatedId);
      tick();

      expect(appRefSpy.detachView).toHaveBeenCalledWith(mockComponentRefInstance.hostView);
      expect(mockComponentRefInstance.destroy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockComponentRefInstance.location.nativeElement);

      let notifications: any[] = [];
      service.notifications$.subscribe(n => notifications = n);
      expect(notifications.length).toBe(0);
    }));

    it('should do nothing if notification ID does not exist', fakeAsync(() => {
      service.remove('non-existent-id');
      tick();

      expect(appRefSpy.detachView).not.toHaveBeenCalled();
      expect(mockComponentRefInstance.destroy).not.toHaveBeenCalled();
      expect(removeChildSpy).not.toHaveBeenCalled();

      let notifications: any[] = [];
      service.notifications$.subscribe(n => notifications = n);
      expect(notifications.length).toBe(1);
    }));
  });
});