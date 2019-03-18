import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  baseUrl = environment.apiUrl + 'authentication/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  picUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPicUrl = this.picUrl.asObservable();

  constructor(private _http: HttpClient) { }

  changeProfilePic(picUrl: string) {
    this.picUrl.next(picUrl);
  }

  login(loginModel: any) {
    return this._http.post(this.baseUrl + 'login', loginModel)
      .pipe(
        map((response: any) => {
          const authData = response;
          if (authData) {
            localStorage.setItem('token', authData.token);
            localStorage.setItem('user', JSON.stringify(authData.userForNav));
            // below code is to get decoded Token, inorder to fetch the name of logged in user.
            this.decodedToken = this.jwtHelper.decodeToken(authData.token);
            this.currentUser = authData.userForNav;

            this.changeProfilePic(this.currentUser.picUrl);
          }
        })
      );
  }

  register(user: User) {
    return this._http.post(this.baseUrl + 'register', user);
  }

  signedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

}
