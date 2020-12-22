import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { messaging } from 'firebase';
import { environment } from 'src/environments/environment';
import { AlertType } from '../models/alertType';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  const alertService = jasmine.createSpyObj('alertService', ['show']);
  const authService = jasmine.createSpyObj('authService', ['login']);
  const router = jasmine.createSpyObj('router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        FormsModule,
        RouterModule.forRoot([]),
      ],
      declarations: [LoginFormComponent],
      providers: [
        { provide: AlertService, useValue: alertService },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login and navigate to chat', (done) => {
    authService.login.and.returnValue(Promise.resolve());
    component
      .login()
      .then(() => expect(router.navigate).toHaveBeenCalledWith(['chat']));
    done();
  });

  it('should login with error', (done) => {
    const message = 'error message';
    authService.login.and.returnValue(Promise.reject(new Error(message)));
    component.login().then(() => {
      expect(alertService.show).toHaveBeenCalledWith(message, AlertType.Error);
      done();
    });
  });
});
