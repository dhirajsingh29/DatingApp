import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../models/user';
import { UserService } from 'src/app/Services/user.service';
import { AlertifyService } from 'src/app/Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ListsResolver implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 5;
    likesParam = 'Likers';

    constructor(private _userService: UserService, private _router: Router,
        private alertify: AlertifyService) {}

    // resolve automatically subscribes to the method; we are not required to do the same
    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this._userService.getUsers(this.pageNumber, this.pageSize, null, this.likesParam)
            .pipe(
                catchError(error => {
                    this.alertify.error('Problem retrieving the data');
                    this._router.navigate(['/home']);
                    return of(null);
                })
            );
    }
}
