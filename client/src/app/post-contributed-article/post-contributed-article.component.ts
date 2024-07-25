import { Component, OnInit } from '@angular/core';
import { postListModel } from '../models/post.modules';
import { LoginsvService } from '../services/loginsv.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-contributed-article',
  templateUrl: './post-contributed-article.component.html',
  styleUrls: ['./post-contributed-article.component.css']
})
export class PostContributedArticleComponent implements OnInit {
  showToast: boolean = false;
  toastMessage: string = '';
  postModel: postListModel = new postListModel();
  selectedFile: File | undefined;
  eventID!: number;
  checked: boolean = false;
  showTerms: boolean = false;

  constructor(
    private loginService: LoginsvService,
    private router: Router,
  ) { }

  ngOnInit() {
    // Tạo một đối tượng ngày mới và gán nó cho thuộc tính submissionDate và closureDate của postModel
    this.postModel.submissionDate = this.getCurrentTime();
    this.checked = true;
  }

  showToastMessage(message: string): void {
    this.showToast = true;
    this.toastMessage = message;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Tắt toast sau 3 giây
  }

  onSubmit() {
    debugger;
    if (!this.postModel.title || !this.postModel.content || !this.selectedFile || !this.checked) {
      alert('Please fill in all information and agree to the terms before submitting.');
      return; // Dừng việc nộp bài nếu có trường nào đó chưa được nhập
    }
    // Tiếp tục xử lý với các giá trị đã định dạng
    const formData = new FormData();
    const userId = localStorage.getItem('userId') ?? '';
    const eventId = localStorage.getItem('EventId') || '';
    const facultyID = localStorage.getItem('facultyID') || '';
    formData.append('title', this.postModel.title);
    formData.append('submissionDate', this.postModel.submissionDate);
    formData.append('closureDate', this.postModel.closureDate);
    formData.append('content', this.postModel.content);
    formData.append('selectedForPublication', String(this.postModel.selectedForPublication));
    formData.append('commented', String(this.postModel.commented));
    formData.append('likes', '0');
    formData.append('dislikes', '0');
    formData.append('views', '0');
    formData.append('status', String(this.postModel.status));
    formData.append('userID', userId);
    console.log(userId);
    formData.append('EventId', eventId);
    formData.append('facultyID', facultyID)
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    formData.append('UploadedDocuments', '');

    this.loginService.postNewPost(formData).subscribe({
      next: (response: any) => {
        console.log(response);
        console.log('The article has been sent successfully.');
        this.showToastMessage('Create post successfully');
        // this.router.navigateByUrl('/home');
        console.log('Redirected to the new article`s detail page');
      },
      error: (error: any) => {
        console.error('An error occurred while submitting the post:', error);
        alert('An error occurred while submitting the post. Please try again later.');
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${hours}:${minutes}`;
  }

  toggleTerms() {
    this.showTerms = !this.showTerms;
  }
}
