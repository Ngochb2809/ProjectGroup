import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginsvService } from '../services/loginsv.service';
import { IloginAt } from '../models/login-request.modules';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css'],
  providers: [MessageService]
})
export class LoginComponentComponent {
  model: IloginAt;
  loginForm: FormGroup;
  showHeaderFooter: boolean = false;

  constructor(
    private loginsvService: LoginsvService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.model = {
      Email: '',
      Password: ''
    };

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.showHeaderFooter = false;
  }

  login() {
    if (this.loginForm.valid) {
      const formData = new FormData();
      formData.append('email', this.loginForm.value.email);
      formData.append('password', this.loginForm.value.password);
      this.loginsvService.loginAu(formData).subscribe({
        next: (response: any) => {
          if (response.isSuccess == true) {
            const headers = response.token;
            this.loginsvService.setToken(headers);
            this.loginsvService.getUser().subscribe({
              next: (rs: any) => {
                localStorage.setItem('userId', rs.id);
                localStorage.setItem('RoleLogin', rs.roles)
                localStorage.setItem('facultyID', rs.facultyID)
              }
            });
            this.router.navigateByUrl('/home');
          } else {
            this.messageService.add({ severity: 'error', summary: response.message, detail: '' });
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      // Mark all form controls as touched to trigger error messages
      this.markFormGroupTouched(this.loginForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  logout() {
    this.loginsvService.logout();
  }
}
