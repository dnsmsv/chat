import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { ChatService } from '../services/chat.service';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  const alertService = jasmine.createSpyObj('alertService', ['show']);
  const authService = jasmine.createSpyObj('authService', ['user', 'logout']);
  const chatService = jasmine.createSpyObj('chatService', ['getUser']);
  const router = jasmine.createSpyObj('router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        FormsModule,
      ],
      declarations: [NavbarComponent],
      providers: [
        { provide: AlertService, useValue: alertService },
        { provide: AuthService, useValue: authService },
        { provide: ChatService, useValue: chatService },
        { provide: Router, useValue: router },
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    const getUserSpy = jasmine.createSpy().and.returnValue(null);
    Object.defineProperty(authService, 'user', {
      get: getUserSpy,
    });
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    const getUserSpy = jasmine.createSpy().and.returnValue(null);
    Object.defineProperty(authService, 'user', {
      get: getUserSpy,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should init userName if authService.user !null and subscribe get !null', () => {
    const getUserSpy = jasmine
      .createSpy()
      .and.returnValue(of({ uid: 'some id' }));
    Object.defineProperty(authService, 'user', {
      get: getUserSpy,
    });
    chatService.getUser.and.returnValue(of({ name: 'some name' }));
    component.ngOnInit();
    expect(component.userName).toEqual('some name');
  });

  it('#ngOnInit should not init userName if authService.user !null and subscribe get !null and getUser return null', () => {
    const getUserSpy = jasmine
      .createSpy()
      .and.returnValue(of({ uid: 'some id' }));
    Object.defineProperty(authService, 'user', {
      get: getUserSpy,
    });
    chatService.getUser.and.returnValue(of(null));
    component.ngOnInit();
    expect(component.userName).toBeUndefined();
  });

  it('#ngOnInit should not init userName if authService.user !null and subscribe get null', () => {
    const getUserSpy = jasmine.createSpy().and.returnValue(of(null));
    Object.defineProperty(authService, 'user', {
      get: getUserSpy,
    });
    chatService.getUser.and.returnValue(of({ name: 'some name' }));
    component.ngOnInit();
    expect(component.userName).toBeNull();
  });

  it('#logout should navigate to login', (done) => {
    router.navigate.calls.reset();
    authService.logout.and.returnValue(Promise.resolve());
    component.logout().then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['login']);
      done();
    });
  });

  it('#logout should call alerService.show', (done) => {
    alertService.show.calls.reset();
    authService.logout.and.returnValue(
      Promise.reject({
        message: 'some message',
      })
    );
    component.logout().then(() => {
      expect(alertService.show).toHaveBeenCalled();
      done();
    });
  });
});
