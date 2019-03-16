import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this._http.get<User[]>(this.baseUrl + 'users');
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

}
