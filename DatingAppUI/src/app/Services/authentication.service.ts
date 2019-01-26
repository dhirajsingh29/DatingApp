import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl = 'http://localhost:5000/api/authentication/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private _http: HttpClient) { }

  login(loginModel: any) {
    return this._http.post(this.baseUrl + 'login', loginModel)
      .pipe(
        map((response: any) => {
          const authData = response;
          if (authData) {
            localStorage.setItem('token', authData.token);
            // below code is to get decoded Token, inorder to fetch the name of logged in user.
            this.decodedToken = this.jwtHelper.decodeToken(authData.token);
            console.log(this.decodedToken);
          }
        })
      );
  }

  register(regModel: any) {
    return this._http.post(this.baseUrl + 'register', regModel);
  }

  signedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

}
