import { Component, OnInit } from '@angular/core';
import { LoginsvService } from '../services/loginsv.service';
import { UserModel } from '../models/post.modules';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manager-student',
  templateUrl: './manager-student.component.html',
  styleUrls: ['./manager-student.component.css']
})
export class ManagerStudentComponent implements OnInit {
  showToast: boolean = false;
  toastMessage: string = '';
  user: UserModel = new UserModel();
  private managerIdSource = new BehaviorSubject<string>('');
  currentUserId = this.managerIdSource.asObservable();
  opEdit: boolean = false;
  opPost: boolean = false;
  editingUser: UserModel | null = null; // Người dùng đang được chỉnh sửa
  listAllUsers: UserModel[] = [];
  fulName: string = ''
  role : any;
  constructor(private loginSv: LoginsvService) {
    //this.loginSv = loginsvService;
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('RoleLogin');
    this.getMasterData();
  }

  getMasterData(): void {
    if (this.role === 'MarketingCoordinator') {
      this.loginSv?.getAllUser().subscribe((data) => {
        this.listAllUsers = data;
        this.listAllUsers = this.listAllUsers.filter(x => x.roles[0] === "Student")
        console.log("postList:", this.listAllUsers);
      },
        (error) => {
          console.error(error);
        });
    } else {
      this.loginSv?.getAllUser().subscribe((data) => {
        this.listAllUsers = data;
        console.log("userList:", this.listAllUsers);
      },
        (error) => {
          console.error(error);
        });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.loginSv.deleteAccount(id).subscribe(
        () => {
          console.log('User deleted successfully.');
          this.showToastMessage('Delete user successfully');
          this.getMasterData(); // Reload user data after deletion
        },
        (error) => {
          console.error('Error while deleting user:', error);
        }
      );
    }
  }

  editUser(user: UserModel): void {
    this.user = { ...user }; 
    this.editingUser = user;
    this.opEdit = true;
  }

  saveUserChanges(userId: string): void {
    if (this.editingUser) {
      const formData = new FormData();
      const userId = localStorage.getItem('userId') ?? '';
      console.log(userId);
      formData.append('fullName', this.editingUser.fullName);
      formData.append('email', this.editingUser.email);
      formData.append('phoneNumber', this.editingUser.phoneNumber);
      this.loginSv.updateUser(this.editingUser.id, formData).subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          this.showToastMessage('User updated successfully');
          this.getMasterData();
          this.cancelEdit(); 
        },
        (error) => {
          console.error('Error while updating user:', error);
        }
      );
    }
  }

  cancelEdit(): void {
    this.opEdit = false; // Đóng form chỉnh sửa
    this.editingUser = null; // Reset editing state
  }

  showToastMessage(message: string): void {
    this.showToast = true;
    this.toastMessage = message;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Tắt toast sau 3 giây
  }
  
  showListPosStudent(id: string, fullName: string): void {
    const numericId = parseInt(id);
    // if (!isNaN(numericId)) {
    this.fulName = fullName
    this.opPost = true;
    this.managerIdSource.next(id);
    // localStorage.setItem('UserIdToGetData', id);
    console.log("id chuyen vao cho omanager", id);
    // } else {
    //   console.error("Invalid id:", id);
    // }
  }
}
