import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { UserService } from 'src/app/Services/user.service';
import { AlertifyService } from 'src/app/Services/alertify.service';

@Component({
  selector: 'da-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getProfileImage = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentProfilePic: Photo;

  constructor(private _authenticationService: AuthenticationService,
      private _userService: UserService, private _alertify: AlertifyService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this._authenticationService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const result: Photo = JSON.parse(response);
        const photo = {
          photoId: result.photoId,
          url: result.url,
          dateAdded: result.dateAdded,
          description: result.description,
          isProfilePic: result.isProfilePic
        };
        this.photos.push(photo);

        if (photo.isProfilePic) {
          this._authenticationService.changeProfilePic(photo.url);
          this._authenticationService.currentUser.picUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this._authenticationService.currentUser));
        }
      }
    };
  }

  setProfilePic(photo: Photo) {
    this._userService.setProfilePic(this._authenticationService.decodedToken.nameid, photo.photoId)
      .subscribe(() => {
        this.currentProfilePic = this.photos.filter(x => x.isProfilePic === true)[0];
        this.currentProfilePic.isProfilePic = false;
        photo.isProfilePic = true;
        // this.getProfileImage.emit(photo.url);
        this._authenticationService.changeProfilePic(photo.url);
        this._authenticationService.currentUser.picUrl = photo.url;
        localStorage.setItem('user', JSON.stringify(this._authenticationService.currentUser));
      }, error => {
        this._alertify.error(error);
      });
  }

  deletePhoto(id: number) {
    this._alertify.confirm('Are you sure you want to delete this photo?', () => {
      this._userService.deletePhoto(this._authenticationService.decodedToken.nameid, id).subscribe(() => {
        this.photos.splice(this.photos.findIndex(x => x.photoId === id), 1);
        this._alertify.success('Photo is deleted successfully');
      }, error => {
        this._alertify.error('Delting photo resulted in an error!!');
      });
    });
  }
}
