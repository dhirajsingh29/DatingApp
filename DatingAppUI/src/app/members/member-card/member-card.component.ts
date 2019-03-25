import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { UserService } from 'src/app/Services/user.service';
import { AlertifyService } from 'src/app/Services/alertify.service';

@Component({
  selector: 'da-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor(private _authenticationService: AuthenticationService, private _userService: UserService,
    private _alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(recipientId: number) {
    this._userService.sendLike(this._authenticationService.decodedToken.nameid, recipientId)
      .subscribe(response => {
        this._alertify.success('You have liked: ' + this.user.nickname);
      }, error => {
        this._alertify.error(error);
      });
  }

}
