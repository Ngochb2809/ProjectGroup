import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginsvService } from '../services/loginsv.service';
import { commentModel, postListModel } from '../models/post.modules';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-detail-post',
  templateUrl: './detail-post.component.html',
  styleUrls: ['./detail-post.component.css']
})
export class DetailPostComponent implements OnInit {
  showToast: boolean = false;
  toastMessage: string = '';
  postId!: number;
  tg!: number;
  commentWord: any;
  titleDialog: string | undefined;
  likedPostsMap: Map<number, boolean> = new Map<number, boolean>();
  editingCommentId: number | null = null;
  editedCommentContent: string = '';
  post!: postListModel;
  formGroup!: FormGroup;
  visible: boolean = false;
  postModel: postListModel = new postListModel();
  fixpost: postListModel = new postListModel();
  commentList!: commentModel[];
  attachmentUrl: string | undefined;
  selectedFile: File | undefined; // Thêm thuộc tính selectedFile vào DetailPostComponent
  downloadUrl: string | undefined;
  attachmentFileName: string | undefined;
  showCommentSection: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginsvService,
    private formBuilder: FormBuilder,
  ) { }
  role: any;
  ngOnInit(): void {
    this.role = localStorage.getItem('RoleLogin')
    this.route.params.subscribe(params => {
      this.postId = params['id'];
    });
    const postId = localStorage.getItem('idContribution');
    if (postId) {
      this.loginService.getPostById(+postId).subscribe(
        (data: postListModel) => {
          this.post = data;
          this.downloadUrl = `https://appgroup1640.azurewebsites.net/api/Contribution/${postId}/file`; // Set download URL
          console.log(this.downloadUrl);
          this.loginService.getFileName(+postId).subscribe(
            fileName => {
              if (fileName !== null) {
                this.attachmentFileName = fileName; // Gán tên tệp tin vào biến attachmentFileName
                console.log(this.attachmentFileName);
              } else {
                // Xử lý khi fileName là null
              }
            },
            error => {
              console.error('Error fetching file name:', error);
            }
          );
          this.createForm();
          this.formGroup.patchValue({
            ContributionID: this.post.contributionId,
            title: this.post.title,
            submissionDate: this.post.submissionDate,
            closureDate: this.post.closureDate,
            content: this.post.content,
            selectedForPublication: this.post.selectedForPublication,
            commented: this.post.commented,
            likes: this.post.likes,
            dislikes: this.post.dislikes,
            views: this.post.views,
            userID: this.post.userID,
            facultyID: this.post.facultyID,
            status: this.post.status,
            filename: this.downloadUrl,

          });
          console.log(this.downloadUrl)
        },
        error => {
          console.error('Error fetching post details:', error);
        }
      );
    }
    const savedLikedPosts = localStorage.getItem('likedPostsMap');
    if (savedLikedPosts !== null) {
      this.likedPostsMap = new Map<number, boolean>(JSON.parse(savedLikedPosts));
    }
  }

  showToastMessage(message: string): void {
    this.showToast = true;
    this.toastMessage = message;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Tắt toast sau 3 giây
  }

  deletePost(): void {
    const Id = localStorage.getItem('idContribution');
    if (Id !== null && confirm('Are you sure you want to delete this post?')) {
      this.loginService.deletePost(+Id).subscribe(
        () => {
          this.router.navigate(['/home']);
          this.showToastMessage('Delete post successfully');
        },
      );
    }
  }
  editPost(post: postListModel): void {
    this.postModel = { ...post };
    this.visible = true;
  }  
  
  saveChanges(postId: number): void {
    debugger;
    if (this.postModel) {
      const postId = localStorage.getItem('idContribution');
      if (!postId || isNaN(+postId) || +postId <= 0) {
        console.error('Invalid ContributionID');
        return;
      }
  
      const formData = new FormData();
      formData.append('contributionID', postId);
      formData.append('Title', this.postModel.title);
      console.log(this.postModel.title);
      formData.append('Content', this.postModel.content);
      console.log(this.postModel.content);
      if (this.selectedFile !== undefined) {
        formData.append('file', this.selectedFile, this.selectedFile.name);
      } else {
        formData.append('file', new File([], ''));
      }
      formData.append('UploadedDocuments', '');
      formData.append('attachmentFileName', this.attachmentFileName || '');
  
      this.loginService.updatePost(+postId, formData).subscribe(
        (response) => {
          console.log('Post updated successfully:', response);
          this.showToastMessage('Post updated successfully');
          this.cancelEdit();
        },
        (error) => {
          console.error('Error while updating post:', error);
          if (error && error.errors && error.errors.Content) {
            this.showToastMessage(error.errors.Content[0]);
          } else {
            this.showToastMessage('Error while updating post');
          }
        }
      );
    }
  }
  
  cancelEdit(): void {
    this.visible = false;
    this.postModel = new postListModel();
  }
  
  createForm() {
    this.formGroup = this.formBuilder.group({
      title: [''], // Khởi tạo title FormControl với giá trị rỗng
      content: [''] // Khởi tạo content FormControl với giá trị rỗng
    });
  }
  
  onFileSelected(event: any) {
    console.log('File selected:', event.target.files[0]);
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile);
  }
}
