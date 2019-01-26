import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../Services/authentication.service';
import { AlertifyService } from '../Services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'da-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  loginModel: any = {};

  constructor(public _authService: AuthenticationService, private _alertify: AlertifyService,
    private _router: Router) { }

  ngOnInit() {
  }

  signIn() {
    this._authService.login(this.loginModel)
      .subscribe(next => {
        this._alertify.success('Signed in Successfully');
      }, error => {
        this._alertify.error(error);
      }, () => {
        this._router.navigate(['/members']);
      });
  }

  signedIn() {
    // const token = localStorage.getItem('token');
    // return !!token; // return boolean value (true or false)
    return this._authService.signedIn();
  }

  signOut() {
    localStorage.removeItem('token');
    this._alertify.message('Signed Out');
    this._router.navigate(['/home']);
  }

}
