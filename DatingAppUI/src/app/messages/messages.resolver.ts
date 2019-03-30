import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import { AlertifyService } from 'src/app/Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../models/message';
import { AuthenticationService } from '../Services/authentication.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 5;
    messageContainer = 'Unread';

    constructor(private _userService: UserService, private _router: Router,
        private alertify: AlertifyService, private _authenticationService: AuthenticationService) {}

    // resolve automatically subscribes to the method; we are not required to do the same
    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this._userService.getMessages(this._authenticationService.decodedToken.nameid,
                this.pageNumber, this.pageSize, this.messageContainer)
            .pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving the members list');
                    this._router.navigate(['/home']);
                    return of(null);
                })
            );
    }
}
