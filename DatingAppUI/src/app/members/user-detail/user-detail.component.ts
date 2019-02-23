import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/Services/user.service';
import { AlertifyService } from 'src/app/Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'da-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: User;
  userGalleryOptions: NgxGalleryOptions[];
  userGalleryImages: NgxGalleryImage[];

  constructor(private _userService: UserService, private alertify: AlertifyService,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // this.getUserDetails();

    // with Resolver in place, in template file we no longer need safe navigation operator(?)
    this._activatedRoute.data.subscribe(data => {
      this.user = data['user'];
    });

    this.userGalleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    this.userGalleryImages = this.getImages();
  }

  getImages() {
    const picUrls = [];
    for (let i = 0; i < this.user.photos.length; i++) {
      picUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      });
    }
    return picUrls;
  }

  // below method is not required anymore, as we are using Resolver to pre fetch the user details
  // getUserDetails() {
  //   this._userService.getUser(+this._activatedRoute.snapshot.params['id'])
  //     .subscribe((user: User) => {
  //       this.user = user;
  //     }, error => {
  //       this.alertify.error(error);
  //     });
  // }

}
