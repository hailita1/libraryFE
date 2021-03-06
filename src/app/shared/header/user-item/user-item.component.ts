import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {UserToken} from '../../../model/user-token';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from '../../../service/auth/authentication.service';
import {UserService} from '../../../service/user/user.service';
import {User} from '../../../model/user';
import {environment} from '../../../../environments/environment';
import {UploadService} from '../../../service/upload/upload.service';

declare var $: any;
declare var Swal: any;
declare const myTest: any;

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss']
})
export class UserItemComponent implements OnInit {

  @ViewChild('content', {static: false}) public childModal!: ModalDirective;
  @Input() listcategorys: Array<any>;
  @Output() eventEmit: EventEmitter<any> = new EventEmitter<any>();
  closeResult: string;
  checkButton = false;
  modalReference!: any;
  isAdd = false;
  isEdit = false;
  isInfo = false;
  title = '';
  type: any;
  currentUser: UserToken;
  user: User;
  isLoading = false;
  myItems: File[] = [];
  hasRoleUser = false;
  hasRoleAdmin = false;
  avt: any;
  model: any;
  submitted = false;
  arrCheck = [];
  form: FormGroup;
  formName = 'cá nhân';
  apiUrl = environment.apiUrl;
  apiFileUrl = environment.apiUploadUrl;
  imageName = '';

  constructor(private modalService: NgbModal,
              private fb: FormBuilder,
              private userService: UserService,
              private authenticationService: AuthenticationService,
              private uploadSevice: UploadService) {
    this.authenticationService.currentUser.subscribe(value => this.currentUser = value);
    if (this.currentUser) {
      const roleList = this.currentUser.roles;
      for (const role of roleList) {
        if (role.authority === 'ROLE_USER') {
          this.hasRoleUser = true;
        }
        if (role.authority === 'ROLE_ADMIN') {
          this.hasRoleAdmin = true;
        }
      }
    }
  }

  updateFormType(type: any) {
    switch (type) {
      case 'add':
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        this.title = `Thêm mới thông tin ${this.formName}`;
        break;
      case 'show':
        this.isInfo = true;
        this.isEdit = false;
        this.isAdd = false;
        this.title = `Xem chi tiết thông tin ${this.formName}`;
        break;
      case 'edit':
        this.isInfo = false;
        this.isEdit = true;
        this.isAdd = false;
        this.title = `Chỉnh sửa thông tin ${this.formName}`;
        break;
      default:
        this.isInfo = false;
        this.isEdit = false;
        this.isAdd = true;
        break;
    }
  }

  ngOnInit(): void {
    this.submitted = false;
    if (this.currentUser != null) {
      this.getUser();
    }
  }

  view(model: any, type = null): void {
    this.arrCheck = this.listcategorys;
    this.open(this.childModal);
    this.type = type;
    this.model = model;
    this.submitted = false;
    this.updateFormType(type);
    if (model.id === null || model.id === undefined) {
      this.form = this.fb.group({
        password: [{value: null, disabled: this.isInfo}, [Validators.required]],
        confpassword: [{value: null, disabled: this.isInfo}, [Validators.required]],
      });
    } else {
      this.form = this.fb.group({
        email: [{value: this.user.email, disabled: this.isInfo}, [Validators.required]],
        fullName: [{value: this.user.fullName, disabled: this.isInfo}, [Validators.required]],
        phone: [{value: this.user.phone, disabled: this.isInfo}, [Validators.required]]
      });
    }
  }

  // tslint:disable-next-line:typedef
  open(content: any) {
    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size: 'md',
    });
    this.modalReference.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  getUser() {
    this.userService.getUser(this.currentUser.id).subscribe(user => {
      this.user = user;
    });
  }

  upload(files: File[]) {
    // pick from one of the 4 styles of file uploads below
    this.basicUpload(files);
  }

  basicUpload(files: File[]) {
    var formData = new FormData();
    Array.from(files).forEach(f => formData.append('file', f));
    this.uploadSevice.uploadBasic(formData)
      .subscribe(event => {
        this.imageName = event.message;
      });
  }

  save() {
    let user: any;
    this.submitted = true;
    if (this.form.invalid) {
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'Kiểm tra thông tin các trường đã nhập'
        });
      });
      return;
    }
    if (this.isEdit) {
      if (this.imageName == null || this.imageName === '') {
        this.avt = this.user.avt;
      } else {
        this.avt = this.imageName;
      }
      user = {
        email: this.form.get('email').value,
        fullName: this.form.get('fullName').value,
        phone: this.form.get('phone').value,
        avt: this.avt,
        id: this.model.id,
      };
    }
    if (this.isEdit) {
      this.userService.updateUser(user).subscribe(res => {
          this.closeModalReloadData();
          $(function() {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'success',
              title: 'Cập nhật thành công'
            });
          });
          this.getUser();
          this.modalReference.dismiss();
        },
        err => {
          $(function() {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });

            Toast.fire({
              type: 'error',
              title: 'Cập nhật thất bại'
            });
          });
        });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public closeModalReloadData(): void {
    this.submitted = false;
    this.eventEmit.emit('success');
  }

  onClick() {
    myTest();
  }

}
