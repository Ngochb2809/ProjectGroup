import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  hideHeaderFooter: boolean = false; 
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Kiểm tra route khi thay đổi để ẩn header và footer trên trang đăng nhập
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.hideHeaderFooter = event.url === '/login'; // Ẩn header và footer nếu đang ở trang đăng nhập
        this.hideHeaderFooter = event.url === '/'; 
      }
    });
  }
}
