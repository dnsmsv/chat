import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertComponent } from '../alert/alert.component';
import { AlertType } from '../models/alertType';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

import { SignupFormComponent } from './signup-form.component';

describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let fixture: ComponentFixture<SignupFormComponent>;
  const alertService = jasmine.createSpyObj('alertService', ['show']);
  const authService = jasmine.createSpyObj('authService', ['signUp']);
  const router = jasmine.createSpyObj('router', ['navigate']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        FormsModule,
        RouterModule.forRoot([]),
      ],
      declarations: [SignupFormComponent],
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
    fixture = TestBed.createComponent(SignupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#signUp should navigate to chat', (done) => {
    authService.signUp.and.returnValue(Promise.resolve());
    component.signUp().then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['chat']);
      done();
    });
  });

  it('#signUp should show alert', (done) => {
    authService.signUp.and.returnValue(
      Promise.reject({ message: 'some message' })
    );
    component.signUp().then(() => {
      expect(alertService.show).toHaveBeenCalledWith(
        'some message',
        AlertType.Error
      );
      done();
    });
  });
});
