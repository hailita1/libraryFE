import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {UserService} from '../../service/user/user.service';
import {Router} from '@angular/router';
import {User} from '../../model/user';

declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-register1',
  templateUrl: './register1.component.html',
  styleUrls: ['./register1.component.scss']
})
export class Register1Component implements OnInit {
  registerForm: FormGroup = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
    fullName: new FormControl(''),
    telephoneNumber: new FormControl(''),
    terms: new FormControl('')
  });
  isSubmitted = false;

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    $(document).ready(function() {
      $('#register').validate({
        rules: {
          userName: {
            required: true
          },
          password: {
            required: true,
            minlength: 6
          },
          fullName: {
            required: true
          },
          telephoneNumber: {
            required: true
          }
        },
        messages: {
          userName: {
            required: 'Nhập địa chỉ userName',
            userName: 'Không đúng định dạng'
          }, telephoneNumber: {
            required: 'Nhập số điện thoại',
          },
          password: {
            required: 'Nhập mật khẩu',
            minlength: 'Mật khẩu phải có ít nhất 6 ký tự'
          },
          fullName: 'Nhập họ và tên bạn'
        },
        errorElement: 'span',
        errorPlacement: function(error, element) {
          error.addClass('invalid-feedback');
          element.closest('.input-group').append(error);
        },
        highlight: function(element, errorClass, validClass) {
          $(element).addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
          $(element).removeClass('is-invalid');
        }
      });
    });
  }

  register() {
    this.isSubmitted = true;
    const user: User = {
      userName: this.registerForm.value.userName,
      password: this.registerForm.value.password,
      fullName: this.registerForm.value.fullName,
      phone: this.registerForm.value.telephoneNumber
    };
    if (user.userName !== '' && user.password !== '' && user.fullName !== '' && user.phone !== '') {
      this.userService.register(user).subscribe(() => {
        this.registerForm.reset();
        this.router.navigate(['/login']).finally(() => {
        });
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'success',
            title: 'Đăng ký thành công'
          });
        });
      }, () => {
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

          Toast.fire({
            type: 'error',
            title: 'Đăng ký thất bại'
          });
        });
      });
    } else {
      $(function() {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });

        Toast.fire({
          type: 'error',
          title: 'Bạn hãy nhập đầy đủ dữ liệu'
        });
      });
    }
  }
}
