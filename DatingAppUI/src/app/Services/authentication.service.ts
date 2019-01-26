import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl = 'http://localhost:5000/api/authentication/';

  constructor(private _http: HttpClient) { }

  login(loginModel: any) {
    return this._http.post(this.baseUrl + 'login', loginModel)
      .pipe(
        map((response: any) => {
          const authData = response;
          if (authData) {
            localStorage.setItem('token', authData.token);
          }
        })
      );
  }

  register(regModel: any) {
    return this._http.post(this.baseUrl + 'register', regModel);
  }

}
