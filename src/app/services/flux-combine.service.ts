import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { FirebeseApiService } from './firebese-api.service';

@Injectable({
  providedIn: 'root'
})
export class FluxCombineService {

  constructor(
    private readonly _apiService : APIService, 
    private readonly _fireStore : FirebeseApiService, 
  ) {   
    

  }
}
