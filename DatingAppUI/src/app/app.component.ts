import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './Services/authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';

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
    if (token) {
      this._authService.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }
}
