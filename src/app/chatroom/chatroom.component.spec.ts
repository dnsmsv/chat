import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { environment } from 'src/environments/environment';
import { ChatFormComponent } from '../chat-form/chat-form.component';
import { FeedComponent } from '../feed/feed.component';
import { ManageFormComponent } from '../manage-form/manage-form.component';
import { ReplyFormComponent } from '../reply-form/reply-form.component';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../services/messages.service';
import { UserListComponent } from '../user-list/user-list.component';

import { ChatroomComponent } from './chatroom.component';

describe('ChatroomComponent', () => {
  let component: ChatroomComponent;
  let fixture: ComponentFixture<ChatroomComponent>;
  let router: Router;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        FormsModule,
        RouterModule.forRoot([]),
      ],
      declarations: [
        ChatroomComponent,
        UserListComponent,
        FeedComponent,
        ReplyFormComponent,
        ChatFormComponent,
        ManageFormComponent,
      ],
      providers: [AuthService, MessagesService, HttpClient, HttpHandler],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.stub();
    fixture = TestBed.createComponent(ChatroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should navigate to login', () => {
  //   component.redirect(null);
  //   expect(router.navigate).toHaveBeenCalledWith('login');
  // });

  // it('should navigate to chat', () => {
  //   component.redirect('some user');
  //   expect(router.navigate).toHaveBeenCalledWith('chat');
  // });
});
