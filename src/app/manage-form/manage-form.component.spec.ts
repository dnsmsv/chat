import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { BehaviorSubject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatMessage } from '../models/chat-message.model';
import { ChatService } from '../services/chat.service';
import { MessagesService } from '../services/messages.service';

import { ManageFormComponent } from './manage-form.component';

describe('ManageFormComponent', () => {
  let component: ManageFormComponent;
  let fixture: ComponentFixture<ManageFormComponent>;
  const messagesService = jasmine.createSpyObj('messagesService', [
    'selectMessage',
    'replyMessage',
  ]);
  const chatService = jasmine.createSpyObj('chatService', ['removeMessage']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
      ],
      declarations: [ManageFormComponent],
      providers: [
        { provide: MessagesService, useValue: messagesService },
        { provide: ChatService, useValue: chatService },
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    const selectedMessageSpy = jasmine.createSpy().and.returnValue(null);
    Object.defineProperty(messagesService, 'selectedMessage', {
      get: selectedMessageSpy,
      configurable: true,
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#deleteHandler should remove message if selectedMessage', () => {
    const someMessage = new ChatMessage();
    const selectedMessageSpy = jasmine
      .createSpy()
      .and.returnValue(of(someMessage));
    Object.defineProperty(messagesService, 'selectedMessage', {
      get: selectedMessageSpy,
      configurable: true,
    });
    fixture = TestBed.createComponent(ManageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.deleteHandler();
    expect(chatService.removeMessage).toHaveBeenCalledWith(someMessage);
  });

  it('#deleteHandler should select message with null if selectedMessage', () => {
    const someMessage = new ChatMessage();
    const selectedMessageSpy = jasmine
      .createSpy()
      .and.returnValue(of(someMessage));
    Object.defineProperty(messagesService, 'selectedMessage', {
      get: selectedMessageSpy,
      configurable: true,
    });
    fixture = TestBed.createComponent(ManageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.deleteHandler();
    expect(messagesService.selectMessage).toHaveBeenCalledWith(null);
  });

  it('#deleteHandler without selectedMessage should not call removeMessage', () => {
    const selectedMessageSpy = jasmine.createSpy().and.returnValue(of(null));
    Object.defineProperty(messagesService, 'selectedMessage', {
      get: selectedMessageSpy,
      configurable: true,
    });
    chatService.removeMessage.calls.reset();
    fixture = TestBed.createComponent(ManageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.deleteHandler();
    expect(chatService.removeMessage).not.toHaveBeenCalled();
  });

  it('#replyHandler should reply message if selectedMessage', () => {
    const someMessage = new ChatMessage();
    const selectedMessageSpy = jasmine
      .createSpy()
      .and.returnValue(of(someMessage));
    Object.defineProperty(messagesService, 'selectedMessage', {
      get: selectedMessageSpy,
      configurable: true,
    });
    fixture = TestBed.createComponent(ManageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.replyHandler();
    expect(messagesService.replyMessage).toHaveBeenCalledWith(someMessage);
  });

  it('#replyHandler should select message with null if selectedMessage', () => {
    const someMessage = new ChatMessage();
    const selectedMessageSpy = jasmine
      .createSpy()
      .and.returnValue(of(someMessage));
    Object.defineProperty(messagesService, 'selectedMessage', {
      get: selectedMessageSpy,
      configurable: true,
    });
    fixture = TestBed.createComponent(ManageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.replyHandler();
    expect(messagesService.selectMessage).toHaveBeenCalledWith(null);
  });

  it('#deleteHandler without selectedMessage should not call removeMessage', () => {
    const selectedMessageSpy = jasmine.createSpy().and.returnValue(of(null));
    Object.defineProperty(messagesService, 'selectedMessage', {
      get: selectedMessageSpy,
      configurable: true,
    });
    messagesService.replyMessage.calls.reset();
    fixture = TestBed.createComponent(ManageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.replyHandler();
    expect(messagesService.replyMessage).not.toHaveBeenCalled();
  });

  it('#cancelHandler should select message with null', () => {
    component.cancelHandler();
    expect(messagesService.selectMessage).toHaveBeenCalledWith(null);
  });
});
