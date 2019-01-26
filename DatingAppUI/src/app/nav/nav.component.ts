import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';

@Component({
  selector: 'da-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  loginModel: any = {};

  constructor(private _authService: AuthenticationService) { }

  ngOnInit() {
  }

  signIn() {
    this._authService.login(this.loginModel)
      .subscribe(next => {
        console.log('logged in successfully');
      }, error => {
        console.log('Failed to login');
      });
  }

  signedIn() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  signOut() {
    localStorage.removeItem('token');
    console.log('signed out');
  }

}
