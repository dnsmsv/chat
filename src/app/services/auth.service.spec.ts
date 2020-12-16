import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';
import { ChatService } from './chat.service';

describe('AuthService', () => {
  let service: AuthService;
  let angularFireAuth: AngularFireAuth;
  const chatService = jasmine.createSpyObj('chatService', ['postUser']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
      ],
      providers: [
        AngularFireAuth,
        { provide: ChatService, useValue: chatService },
        AuthService,
        HttpClient,
        HttpHandler,
      ],
    });
    service = TestBed.inject(AuthService);
    angularFireAuth = TestBed.inject(AngularFireAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#login should call next for user', (done) => {
    const authObj = {
      signInWithEmailAndPassword: (email, password) =>
        Promise.resolve({ user: 'some user' }),
    };
    Object.defineProperty(angularFireAuth, 'auth', {
      get: jasmine.createSpy().and.returnValue(authObj),
    });
    const nextSpy = spyOn(service.user, 'next');
    nextSpy.calls.reset();
    service.login('email', 'password').then(() => {
      expect(service.user.next).toHaveBeenCalled();
      done();
    });
  });

  it('#logout should call user.next', (done) => {
    const authObj = {
      signOut: () => Promise.resolve(),
    };
    Object.defineProperty(angularFireAuth, 'auth', {
      get: jasmine.createSpy().and.returnValue(authObj),
    });
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue({
        value: 'some value',
        next: jasmine.createSpy().and.returnValue((param) => {}),
      }),
    });
    service.logout().then(() => {
      expect(service.user.next).toHaveBeenCalledWith(null);
      done();
    });
  });

  it('#logout should not call user.next', (done) => {
    const authObj = {
      signOut: () => Promise.resolve(),
    };
    Object.defineProperty(angularFireAuth, 'auth', {
      get: jasmine.createSpy().and.returnValue(authObj),
    });
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue({
        value: null,
        next: jasmine.createSpy().and.returnValue((param) => {}),
      }),
    });
    service.logout().then(() => {
      expect(service.user.next).not.toHaveBeenCalledWith(null);
      done();
    });
  });

  it('#signUp should call next for user', (done) => {
    const authObj = {
      createUserWithEmailAndPassword: (email, password) =>
        Promise.resolve({ user: 'some user' }),
    };
    Object.defineProperty(angularFireAuth, 'auth', {
      get: jasmine.createSpy().and.returnValue(authObj),
    });
    const nextSpy = spyOn(service.user, 'next');
    nextSpy.calls.reset();
    service.signUp('email', 'password', 'display name').then(() => {
      expect(service.user.next).toHaveBeenCalled();
      done();
    });
  });

  it('#signUp should post user', (done) => {
    const authObj = {
      createUserWithEmailAndPassword: (email, password) =>
        Promise.resolve({ user: 'some user' }),
    };
    Object.defineProperty(angularFireAuth, 'auth', {
      get: jasmine.createSpy().and.returnValue(authObj),
    });
    const nextSpy = spyOn(service.user, 'next');
    chatService.postUser.calls.reset();
    service.signUp('email', 'password', 'display name').then(() => {
      expect(chatService.postUser).toHaveBeenCalled();
      done();
    });
  });
});
