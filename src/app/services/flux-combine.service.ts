import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { FirebaseApiService } from './firebase-api.service';

@Injectable({
  providedIn: 'root'
})
export class FluxCombineService {

  constructor(
    private readonly _apiService : APIService,
    private readonly _fireStore : FirebaseApiService,
  ) {


  }
}
