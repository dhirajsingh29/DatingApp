import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from 'src/app/Services/user.service';
import { AlertifyService } from 'src/app/Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/Services/authentication.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    constructor(private _userService: UserService, private _router: Router,
        private alertify: AlertifyService, private _authenticationService: AuthenticationService) {}

    // resolve automatically subscribes to the method; we are not required to do the same
    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this._userService.getUser(this._authenticationService.decodedToken.nameid)
            .pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving your details');
                    this._router.navigate(['/members']);
                    return of(null);
                })
            );
    }
}
