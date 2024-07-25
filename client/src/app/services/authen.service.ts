import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { LoginsvService } from './loginsv.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';

@Injectable({
  providedIn: 'root'
})
export class AuthenService implements HttpInterceptor {

  constructor(private toast: NgToastService,
    private router: Router,
    private auth: LoginsvService
  ) { }
  canActivate(route: AppRoutingModule) {
    if (this.auth.getToken()) {
      return true;
    } else {
      // alert('register successfully');
      this.router.navigate(['login'])
      return false;
    }

  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.auth.getToken();
    if (token) {

      const authRequest = request.clone({
        headers: request.headers.set('Authorization', `bearer ${token}`)
      });
      return next.handle(authRequest);
    }
    return <any>next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            return this.handleUnAuthorizedError(request, next);
          }
        }
        return throwError(() => err)
      })
    );
  }

  handleUnAuthorizedError(request: HttpRequest<any>, next: HttpHandler): any {
    throw new Error("Error sth ")
  }

  // return next.handle(request);
}

