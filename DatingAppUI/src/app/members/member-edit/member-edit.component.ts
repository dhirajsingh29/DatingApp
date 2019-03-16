import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/Services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/Services/user.service';
import { AuthenticationService } from 'src/app/Services/authentication.service';

@Component({
  selector: 'da-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm;
  user: User;
  picUrl: string;

  // HostListener here helps us to access the host of our application (browser here)
  // and prevents browser of closing accidentally if we clicked Close by mistake
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(private _activatedRoute: ActivatedRoute, private _alertify: AlertifyService,
    private _userService: UserService, private _authenticationService: AuthenticationService) { }

  ngOnInit() {
    this._activatedRoute.data.subscribe(data => {
      this.user = data['user'];
    });
    this._authenticationService.currentPicUrl.subscribe(picUrl => this.picUrl = picUrl);
  }

  updateProfile() {
    this._userService.updateUser(this._authenticationService.decodedToken.nameid, this.user)
      .subscribe(next => {
        this._alertify.success('Profile updated successfully');
        this.editForm.reset(this.user);
      }, error => {
        this._alertify.error(error);
      });
  }

  updateMainProfileImage(picUrl) {
    this.user.picUrl = picUrl;
  }

}
