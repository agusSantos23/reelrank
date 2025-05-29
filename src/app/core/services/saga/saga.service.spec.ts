import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SagaService } from './saga.service';
import { environment } from '../../../../environments/environment';
import { Saga } from '../../models/Saga.model';
import { HttpHeaders } from '@angular/common/http';
import { Avatar } from '../../models/Avatar.model';

describe('SagaService', () => {
  let service: SagaService;
  let httpTestingController: HttpTestingController;
  let apiUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SagaService]
    });

    service = TestBed.inject(SagaService);
    httpTestingController = TestBed.inject(HttpTestingController);
    apiUrl = environment.apiUrl;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getSagas', () => {
    it('should return an array of sagas', () => {
         const mockAvatars1: Avatar[] = [
        { id: 'a1', saga_id: '1', image_id: 'img1', created_at: '2001-12-19T00:00:00Z', updated_at: '2001-12-19T00:00:00Z' }
      ];
      const mockAvatars2: Avatar[] = [
        { id: 'a2', saga_id: '2', image_id: 'img2', created_at: '1977-05-25T00:00:00Z', updated_at: '1977-05-25T00:00:00Z' }
      ];

      const mockSagas: Saga[] = [
        { id: '1', name: 'The Lord of the Rings', created_at: '2001-12-19T00:00:00Z', avatars: mockAvatars1 },
        { id: '2', name: 'Star Wars', created_at: '1977-05-25T00:00:00Z', avatars: mockAvatars2 }
      ];


      service.getSagas().subscribe(sagas => {
        expect(sagas).toEqual(mockSagas);
      });

      const req = httpTestingController.expectOne(`${apiUrl}/sagas`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSagas);
    });

    it('should make a GET request to the correct URL', () => {
      service.getSagas().subscribe();

      const req = httpTestingController.expectOne(`${apiUrl}/sagas`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should handle network errors', () => {
      const errorMessage = 'Network error';

      service.getSagas().subscribe({
        next: () => fail('should have failed with the network error'),
        error: error => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Server Error');
        }
      });

      const req = httpTestingController.expectOne(`${apiUrl}/sagas`);
      req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });
    });
  });
});