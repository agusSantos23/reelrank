import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Saga } from '../../models/Saga.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SagaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  constructor() { }

  getSagas(): Observable<Saga[]>{
    return this.http.get<Saga[]>(`${this.apiUrl}/sagas`);
  }
}
