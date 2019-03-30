import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { PaginatedResult } from '../models/Pagination';
import { map } from 'rxjs/operators';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  getUsers(pageNumber?, itemsPerPage?, userParams?, likesParam?): Observable<PaginatedResult<User[]>> {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

    let httpParams = new HttpParams();
    if (pageNumber != null && itemsPerPage != null) {
      httpParams = httpParams.append('pageNumber', pageNumber);
      httpParams = httpParams.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      httpParams = httpParams.append('minAge', userParams.minAge);
      httpParams = httpParams.append('maxAge', userParams.maxAge);
      httpParams = httpParams.append('gender', userParams.gender);
      httpParams = httpParams.append('orderBy', userParams.orderBy);
    }

    if (likesParam === 'Likers') {
      httpParams = httpParams.append('likers', 'true');
    }

    if (likesParam === 'Likees') {
      httpParams = httpParams.append('likees', 'true');
    }

    /*
      * by default our getUsers method was returning Observable from body in initiall implementation,
      * but we need access to Headers too as we are sending those from API.
      * Hence, we are utlizing observe while making get request,
      * in order to gain access to full HttpResponse */
    /*
      * as we are getting headers also in our response, so we need to manipulate the result
      * using pipe, in order to get pagination details from HttpResponseHeaders*/
    return this._http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params: httpParams })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getUser(id): Observable<User> {
    return this._http.get<User>(this.baseUrl + 'users/' + id);
  }

  updateUser(id: number, user: User) {
    return this._http.put(this.baseUrl + 'users/' + id, user);
  }

  setProfilePic(userId: number, id: number) {
    return this._http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setProfilePic', {});
  }

  deletePhoto(userId: number, id: number) {
    return this._http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id);
  }

  sendLike(id: number, recipientId: number) {
    return this._http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId, {});
  }

  getMessages(id: number, pageNumber?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    let httpParams = new HttpParams();
    httpParams = httpParams.append('MessageContainer', messageContainer);

    if (pageNumber != null && itemsPerPage != null) {
      httpParams = httpParams.append('pageNumber', pageNumber);
      httpParams = httpParams.append('pageSize', itemsPerPage);
    }

    return this._http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', { observe: 'response', params: httpParams })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number) {
    return this._http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
  }

  sendMessage(id: number, message: Message) {
    return this._http.post(this.baseUrl + 'users/' + id + '/messages', message);
  }

  deleteMessage(id: number, userId: number) {
    return this._http.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {});
  }

  markAsRead(userId: number, messageId: number) {
    this._http.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {})
      .subscribe();
  }
}
