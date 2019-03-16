import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './Services/authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from './models/user';

@Component({
  selector: 'da-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'DatingApp';
  jwtHelper = new JwtHelperService();

  constructor(private _authService: AuthenticationService) {}

  ngOnInit() {
    const token  = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (token) {
      this._authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (user) {
      this._authService.currentUser = user;
      this._authService.changeProfilePic(user.picUrl);
    }
  }
}
