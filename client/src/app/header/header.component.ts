import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LoginsvService } from '../services/loginsv.service';
import { postListModel, Notification } from '../models/post.modules';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy {
  loggedInUser: string | null = null;
  notifications: Notification[] = [];
  isNotificationDropdownOpen: boolean = false;
  private updateSubscription: Subscription | undefined;
  showHeaderFooter: boolean = true;
  role: any
  constructor(
    private loginsvService: LoginsvService,
    private router: Router
  ) {
    this.loggedInUser = this.loginsvService.getLoggedInUser();
    this.startPolling();
  }
  ngOnInit(): void {
    this.role = localStorage.getItem('RoleLogin')
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showHeaderFooter = event.url === '/login';
      }
    });
  }
  ngOnDestroy(): void {
    this.stopPolling();
  }

  private startPolling(): void {
    this.updateSubscription = interval(5000).subscribe(() => {
      this.getNotifications();
    });
  }

  private stopPolling(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  getNotifications(): void {
    this.loginsvService.getNotifications()
      .subscribe(notifications => {
        this.notifications = notifications;
      });
    this.toggleNotificationDropdown();
  }

  logout() {
    this.loginsvService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleNotificationDropdown(): void {
    this.isNotificationDropdownOpen = !this.isNotificationDropdownOpen;
  }
}
