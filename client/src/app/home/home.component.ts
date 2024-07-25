import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginsvService } from '../services/loginsv.service';
import { postListModel } from '../models/post.modules';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  loggedInUser: string | null = null;
  postId: number;
  postLisst: postListModel[] = [];
  post: postListModel;
  isAdmin: boolean = false; // Thêm biến để lưu trữ trạng thái isAdmin
  constructor(
    private loginsvService: LoginsvService,
    private router: Router
  ) {
    this.loggedInUser = this.loginsvService.getLoggedInUser();
    this.postId = 0;
    this.post = new postListModel();
  }
  role: any
  ngOnInit() {
    this.role = localStorage.getItem('RoleLogin')
    // this.loggedInUser = this.loginsvService.getLoggedInUser();
    // this.checkAdminStatus();
  }
  logout() {
    this.loginsvService.logout();
    this.router.navigateByUrl('/login');
  }
  toManagerStudent() {
    this.router.navigateByUrl('/managerStudent');
  }
  // checkAdminStatus() {
  //   this.loginsvService.isAdminUser().subscribe(isAdmin => {
  //     this.isAdmin = isAdmin;
  //   });
  // }
}
