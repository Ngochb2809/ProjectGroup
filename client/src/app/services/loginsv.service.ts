import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';
import { IloginAt } from '../models/login-request.modules';
import { register } from '../models/empt-request.modules';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { postListModel, Notification } from '../models/post.modules';
import { catchError } from 'rxjs/operators';
import { Form } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})
export class LoginsvService {
  downloadFile(postId: number) {
    throw new Error('Method not implemented.');
  }
  private baseUrl: string = 'https://appgroup1640.azurewebsites.net/api/';

  //https://localhost:7222
  //https://appgroup1640.azurewebsites.net
  constructor(private http: HttpClient,
    private router: Router
  ) { }
  loginAu(formData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'Account/login', formData)
      .pipe(
        tap(response => {
          console.log('Token từ máy chủ:', response.token); // Ghi log token trả về từ máy chủ
        })
      );
  }
  regiss(formData: FormData) {
    return this.http.post<void>(this.baseUrl + 'Account/register', formData);
  }

  postNewPost(formData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'Contribution', formData,);
  }

  getPost(): Observable<any[]> { // Thay đổi kiểu trả về thành một mảng các bài đăng
    const url = this.baseUrl + 'Contribution';
    return this.http.get<any[]>(url); // Sử dụng phương thức GET thay vì POST
  }

  getPostById(id: number): Observable<postListModel> {
    // console.log("getPostByI", id);
    const url = this.baseUrl + 'Contribution/' + id; // URL sẽ bao gồm id của bài đăng
    return this.http.get<postListModel>(url); //d //
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete<void>(`${this.baseUrl}Contribution/${id}`);
  }

  updatePost(id: number, formData: FormData): Observable<any> {
    console.log("getPostByI", id);
    return this.http.put(this.baseUrl + `Contribution/${id}`, formData);
  }

  // updatePost(id: number, formData: FormData): Observable<any> {
  //   console.log("getPostByI", id);
  //   const headers = { 'Content-Type': 'multipart/form-data' };
  //   const url = this.baseUrl + 'Contribution/'+ id;
  //   return this.http.put(url, formData, { headers });
  // }
  setToken(tk: any) {
    return localStorage.setItem('token', tk)
  }
  getToken() {
    return localStorage.getItem('token')
  }
  logout() {
    this.router.navigateByUrl('/home')
    return localStorage.clear()
  }
  getLoggedInUser(): string | null {
    // Lấy token từ local storage
    const token = this.getToken();
    // Kiểm tra xem token có tồn tại không
    if (token) {
      // Giải mã token và lấy thông tin người dùng từ token (trong trường hợp này, token chứa email của người dùng)
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userEmail = decodedToken.email;
      // Trả về email của người dùng
      return userEmail;
    } else {
      // Trả về null nếu không có token
      return null;
    }
  }
  getFileName(id: number): Observable<string> {
    return this.http.get(`https://appgroup1640.azurewebsites.net/api/Contribution/${id}/file`, { responseType: 'text' }).pipe(
      map(response => {
        // Tách tên tệp tin từ URL
        const fileName = response.substring(response.lastIndexOf('/') + 1);
        // console.log(fileName);
        return fileName;
      }),
      catchError(error => {
        console.error('Error fetching file name:', error);
        return throwError(error);
      })
    );
  }
  getLike(formData: FormData, isContribution: boolean) {
    return this.http.post<void>(this.baseUrl + `Interactions/like?isContribution=${isContribution}`, formData);
  }

  getdisLike(formData: FormData, isContribution: boolean) {
    return this.http.post<void>(this.baseUrl + `Interactions/dislike?isContribution=${isContribution}`, formData);
  }

  getComment(id: number) {
    const url = this.baseUrl + 'Contribution/' + id + '/comment'; // URL sẽ bao gồm id của bài đăng
    return this.http.get<any>(url); //d //
  }

  postComment(formData: FormData) {
    return this.http.post<any>(this.baseUrl + 'Interactions/comment', formData);
  }
  deleteComment(id: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + `Interactions/deleteComment/${id}`);
  }

  getDashboardContributionsByFaculty(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'Dashboard/contributions/byfaculty');
  }
  getDashboardContributionsByStudent(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'Dashboard/statistics');
  }

  exportDashboardStatisticsAsExcel(): Observable<Blob> {
    return this.http.get(this.baseUrl + 'Dashboard/export/statistics/excel', { responseType: 'blob' });
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseUrl + 'Interactions/notifications');
  }
  getUser() {
    const url = this.baseUrl + 'Account/currentUser';
    return this.http.get<any[]>(url);
  }
  editComment(commentId: number, formData: FormData): Observable<any> {
    return this.http.put<any>(this.baseUrl + `Interactions/editcomment/${commentId}`, formData);
  }
  getAllUser(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Account/users');
  }
  createEvent(formData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'Events', formData);
  }
  getAllEvent(): Observable<any> {
    return this.http.get<any>(this.baseUrl + '/Events/all');
  }
  postEvent(eventID: number, formData: FormData) {
    return this.http.put<any>(this.baseUrl + `Events/${eventID}`, formData);
  }
  deleteEvent(id: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + `Events/${id}`);
  }
  updateUser(id: string, formData: FormData): Observable<any> {
    //console.log("getPostByI", id);
    return this.http.put(`${this.baseUrl}Account/${id}`, formData);
  }
  getStudentbyId(id: any) {
    const url = this.baseUrl + `Account/${id}`; // URL sẽ bao gồm id của bài đăng
    return this.http.get<any>(url); //
  }
  deleteAccount(id: string): Observable<any> {
    return this.http.delete<void>(this.baseUrl + `Account/${id}?id=${id}`);
  }
  getPostByEventId(id: any) {
    const url = this.baseUrl + `Contribution/event?id=${id}`; // URL sẽ bao gồm id của bài đăng
    return this.http.get<any>(url); //
  }
  getPostByUserId(id: any) {
    const url = this.baseUrl + `Contribution/user?id=${id}`; // URL sẽ bao gồm id của bài đăng
    return this.http.get<any>(url); //
  }
  getComtByComt(id: any) {
    const url = this.baseUrl + `Contribution/${id}/commentofcomment`; // URL sẽ bao gồm id của bài đăng
    return this.http.get<any>(url); //
  }
  postCmtofCmt(formData: FormData) {
    return this.http.post<any>(this.baseUrl + 'Interactions/comment/comment', formData);
  }
}
