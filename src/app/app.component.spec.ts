import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { ChatService } from './services/chat.service';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { NavbarComponent } from './navbar/navbar.component';
import { AlertComponent } from './alert/alert.component';
import { AuthService } from './services/auth.service';
import { app } from 'firebase';
import { StatusType } from './models/statusType';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  const chatService = jasmine.createSpyObj('chatService', ['updateUser']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
      ],
      declarations: [AppComponent, NavbarComponent, AlertComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: ChatService, useValue: chatService },
        AuthService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    chatService.updateUser.calls.reset();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'chat'`, () => {
    expect(app.title).toEqual('chat');
  });

  it('#handleWindowFocus should call updateUser with Online', () => {
    window.dispatchEvent(new Event('focus'));
    expect(chatService.updateUser).toHaveBeenCalledWith(StatusType.Online);
  });

  it('#handleWindowBlur should call updateUser with Offline', () => {
    jasmine.clock().install();
    window.dispatchEvent(new Event('blur'));
    jasmine.clock().tick(200000);
    expect(chatService.updateUser).toHaveBeenCalledWith(StatusType.Offline);
    jasmine.clock().uninstall();
  });

  it('#handleWindowBeforeunload should call updateUser with Online', () => {
    window.dispatchEvent(new Event('beforeunload'));
    expect(chatService.updateUser).toHaveBeenCalledWith(StatusType.Offline);
  });
});
