import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { PanelMenuModule } from 'primeng/panelmenu';
import { ChipsModule } from 'primeng/chips';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms'
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { AuthenService } from './services/authen.service';
import { RegisterComponent } from './register/register.component';
import { PostContributedArticleComponent } from './post-contributed-article/post-contributed-article.component';
import { LayoutComponent } from './layout/layout.component';
import { ShowPostComponent } from './show-post/show-post.component';
import { DetailPostComponent } from './detail-post/detail-post.component';
import { DialogModule } from 'primeng/dialog';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import 'chart.js/auto';
import { ManagerStudentComponent } from './manager-student/manager-student.component';
import { EventComponent } from './event/event.component';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastComponent } from './toast/toast.component';


@NgModule({
  declarations: [
    AppComponent,
    PostContributedArticleComponent,
    routingComponents,
    RegisterComponent,
    LayoutComponent,
    ShowPostComponent,
    DetailPostComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    ManagerStudentComponent,
    EventComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CardModule,
    MultiSelectModule,
    BrowserAnimationsModule,
    PanelMenuModule,
    ChipsModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    PasswordModule,
    MessagesModule,
    HttpClientModule,
    TableModule,
    CheckboxModule,
    DialogModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthenService, multi: true }, { provide: EventComponent, }, { provide: ManagerStudentComponent, }],
  bootstrap: [AppComponent]
})
export class AppModule { }
