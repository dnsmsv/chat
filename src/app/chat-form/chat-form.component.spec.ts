import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';
import { AlertType } from '../models/alert-type';
import { ChatMessage } from '../models/chat-message.model';
import { AlertService } from '../services/alert.service';
import { ChatService } from '../services/chat.service';
import { MessagesService } from '../services/messages.service';

import { ChatFormComponent } from './chat-form.component';

describe('ChatFormComponent', () => {
  let component: ChatFormComponent;
  let fixture: ComponentFixture<ChatFormComponent>;
  const alertService = jasmine.createSpyObj('AlertService', ['show']);
  const chatService = jasmine.createSpyObj('ChatService', ['postMessage']);
  let messageService: MessagesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        FormsModule,
      ],
      declarations: [ChatFormComponent],
      providers: [
        { provide: AlertService, useValue: alertService },
        { provide: ChatService, useValue: chatService },
        MessagesService,
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    messageService = TestBed.inject(MessagesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should focus on chatInput', () => {
    jasmine.clock().install();
    messageService.replyMessage(new ChatMessage());
    jasmine.clock().tick(350);
    const chatInput = fixture.nativeElement.querySelector('#chatInput');
    expect(document.activeElement === chatInput).toBeTruthy();
    jasmine.clock().uninstall();
  });

  it('should send and clear message', () => {
    component.send();
    expect(component.message).toBe('');
  });

  it('should send and clear replyedMessageKey', () => {
    component.replyedMessageKey = 'value';
    component.send();
    expect(component.replyedMessageKey).toBe(null);
  });

  it('should send and clear replyedMessage', () => {
    component.send();
    messageService.repliedMessage.subscribe((message) => {
      expect(message).toBe(null);
    });
  });

  it('should send with error', () => {
    const errorMessage: string = 'some error';
    chatService.postMessage.and.throwError(errorMessage);
    component.send();
    expect(alertService.show).toHaveBeenCalledWith(
      errorMessage,
      AlertType.Error
    );
  });

  it('should handle submit and send', () => {
    let newEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
    Object.defineProperty(newEvent, 'keyCode', {
      get: function () {
        return 13;
      },
    });
    component.message = 'some message';
    spyOn(component, 'send');
    component.handleSubmit(newEvent);
    expect(component.send).toHaveBeenCalled();
  });

  it('should handle submit and chould not call send with null message', () => {
    let newEvent: KeyboardEvent = document.createEvent('KeyboardEvent');
    Object.defineProperty(newEvent, 'keyCode', {
      get: function () {
        return 13;
      },
    });
    component.message = null;
    spyOn(component, 'send');
    component.handleSubmit(newEvent);
    expect(component.send).not.toHaveBeenCalled();
  });
});
