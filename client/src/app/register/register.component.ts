
import { FormGroup, Validators, FormBuilder} from '@angular/forms'
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { LoginsvService } from '../services/loginsv.service';
// import { register } from '../models/empt-request.modules';
// import { InputTextModule } from 'primeng/inputtext';
import { Component, OnInit } from '@angular/core';
import { register } from '../models/empt-request.modules';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent  implements OnInit{
  registerForm: FormGroup;
  roles: register[] = [];
  loginService: any;
  loggedInUser: any;
  //register: register ;
  constructor(private lgsv: LoginsvService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
  )  {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', Validators.required],
      password: ['', Validators.required],
      faculty: ['', Validators.required],
      roles: ['', Validators.required] // Không cần thiết phải điền roles, vì nó là tùy chọn
    });

  }
  ngOnInit(): void {

  }
  
  submit() {  
    if (this.registerForm.invalid) {
      // Nếu form chưa hợp lệ (có trường bắt buộc chưa được nhập), không thực hiện yêu cầu đăng ký và hiển thị thông báo lỗi
      this.messageService.add({ severity: 'error', summary: 'Please fill in all required fields', detail: '' });
      return;
    }
    console.log('register', this.registerForm.value)
    const formData = new FormData();
    formData.append('email', this.registerForm.value.email);
    formData.append('fullName', this.registerForm.value.fullName);
    formData.append('password', this.registerForm.value.password);
    formData.append('faculty', this.registerForm.value.faculty.toString()); // Chuyển đổi faculty thành chuỗi trước khi thêm vào FormData
    formData.append('roles', this.registerForm.value.roles); // Nếu roles là một mảng các chuỗi, bạn cần xử lý nó tương ứng
    this.lgsv.regiss(formData).subscribe({
      next: (response: any) => {
        if (response.isSuccess == true) {
          const headers = response.token;
          this.router.navigateByUrl('/home');
        } else {
          this.messageService.add({ severity: 'error', summary: response.message, detail: '' });
        }
      },
      error: (err) => {
        console.log(err);
        // this.messageService.add({ severity: 'error', summary: 'Registration Error', detail: 'An error occurred while processing your registration request. Please try again later.' });
      },
    });
  }
}
