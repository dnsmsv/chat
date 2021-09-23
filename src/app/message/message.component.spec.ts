import { CommonModule } from '@angular/common';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';
import { ChatMessage } from '../models/chat-message.model';
import { ChatService } from '../services/chat.service';
import { MessagesService } from '../services/messages.service';

import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let messagesService: MessagesService;
  const chatService = jasmine.createSpyObj('chatService', ['getMessage']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
      ],
      declarations: [MessageComponent],
      providers: [
        MessagesService,
        { provide: ChatService, useValue: chatService },
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    messagesService = TestBed.inject(MessagesService);
    spyOn(messagesService, 'selectMessage');
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should create with selected message', () => {
  //   messagesService.selectedMessage = new BehaviorSubject<ChatMessage>(null);
  //   const newFixture = TestBed.createComponent(MessageComponent);
  //   const newComponent = newFixture.componentInstance;
  //   const someMessage = new ChatMessage();
  //   newComponent.chatMessage = someMessage;
  //   messagesService.selectedMessage.next(someMessage);
  //   jasmine.clock().tick(150);
  //   expect(newComponent.selected).toBeTruthy();
  // });

  // it('should create with null selectedMessage message', () => {
  //   component.selected = true;
  //   const someMessage = new ChatMessage();
  //   component.chatMessage = someMessage;
  //   messagesService.selectedMessage = null;
  //   TestBed.createComponent(MessageComponent);
  //   jasmine.clock().tick(100);
  //   expect(component.selected).toBeTruthy();
  // });

  // it('should create with selected message', () => {
  //   const message = {
  //     get: new ChatMessage(),
  //     subscribe(): ChatMessage {
  //       return new ChatMessage();
  //     },
  //   };
  //   const selectedMessageSpy = jasmine.createSpy().and.returnValue(message);
  //   spyOn(message, 'subscribe').and.returnValue(new ChatMessage());
  //   Object.defineProperty(messageService, 'selectedMessage', {
  //     get: selectedMessageSpy,
  //   });
  //   TestBed.createComponent(MessageComponent);
  //   expect(messageService.selectedMessage.subscribe).toHaveBeenCalled();
  // });

  it('should init without replyed message', () => {
    const chatMessage = new ChatMessage(
      'name',
      'email',
      'message',
      new Date(1),
      false,
      null
    );
    component.ngOnInit(chatMessage);
    expect(component.messageContent).toEqual(chatMessage.message);
    expect(component.timeStamp).toEqual(chatMessage.timeSent);
    expect(component.userEmail).toEqual(chatMessage.email);
    expect(component.userName).toEqual(chatMessage.userName);
    expect(component.isOwnMessage).toEqual(chatMessage.isOwn);
  });

  it('should init with replyed message and null message from chat service', () => {
    const chatMessage = new ChatMessage(
      'name',
      'email',
      'message',
      new Date(1),
      false,
      'replyed message'
    );
    component.repliedMessage = null;
    chatService.getMessage.and.returnValue(null);
    component.ngOnInit(chatMessage);
    expect(component.messageContent).toEqual(chatMessage.message);
    expect(component.timeStamp).toEqual(chatMessage.timeSent);
    expect(component.userEmail).toEqual(chatMessage.email);
    expect(component.userName).toEqual(chatMessage.userName);
    expect(component.isOwnMessage).toEqual(chatMessage.isOwn);
    expect(component.repliedMessage).toBeNull();
  });

  it('should init with replyed message and message from chat service', () => {
    const chatMessage = new ChatMessage(
      'name',
      'email',
      'message',
      new Date(1),
      false,
      'replyed message'
    );
    component.repliedMessage = null;
    const someMessage = new ChatMessage();
    chatService.getMessage.and.returnValue(someMessage);
    component.ngOnInit(chatMessage);
    expect(component.messageContent).toEqual(chatMessage.message);
    expect(component.timeStamp).toEqual(chatMessage.timeSent);
    expect(component.userEmail).toEqual(chatMessage.email);
    expect(component.userName).toEqual(chatMessage.userName);
    expect(component.isOwnMessage).toEqual(chatMessage.isOwn);
    expect(component.repliedMessage).toEqual(someMessage);
  });

  it('should init with replyed message length > 38 and message from chat service', () => {
    const chatMessage = new ChatMessage(
      'name',
      'email',
      'message',
      new Date(1),
      false,
      'replyed message'
    );
    component.repliedMessage = null;
    const someMessage = new ChatMessage();
    someMessage.message =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
    chatService.getMessage.and.returnValue(someMessage);
    component.ngOnInit(chatMessage);
    expect(component.messageContent).toEqual(chatMessage.message);
    expect(component.timeStamp).toEqual(chatMessage.timeSent);
    expect(component.userEmail).toEqual(chatMessage.email);
    expect(component.userName).toEqual(chatMessage.userName);
    expect(component.isOwnMessage).toEqual(chatMessage.isOwn);
    expect(component.repliedMessage.message).toEqual(
      'Lorem ipsum dolor sit amet, consectetu...'
    );
  });

  it('should mobile version with window width 100', () => {
    const windowWidthSpy = jasmine.createSpy().and.returnValue(100);
    Object.defineProperty(window.screen, 'availWidth', {
      get: windowWidthSpy,
    });
    expect(component.mobileVersion).toBeTruthy();
  });

  it('should select message if !mobileVersion and selected', () => {
    const getMobileVersionSpy = jasmine.createSpy().and.returnValue(false);
    Object.defineProperty(component, 'mobileVersion', {
      get: getMobileVersionSpy,
    });
    component.selected = true;
    component.mouseDownHandler();
    expect(messagesService.selectMessage).toHaveBeenCalledWith(null);
  });

  it('should not select message if mobileVersion', () => {
    const getMobileVersionSpy = jasmine.createSpy().and.returnValue(true);
    Object.defineProperty(component, 'mobileVersion', {
      get: getMobileVersionSpy,
    });
    component.mouseDownHandler();
    expect(messagesService.selectMessage).not.toHaveBeenCalled();
  });

  it('should select message if !mobileVersion and !selected', () => {
    const getMobileVersionSpy = jasmine.createSpy().and.returnValue(false);
    Object.defineProperty(component, 'mobileVersion', {
      get: getMobileVersionSpy,
    });
    component.selected = false;
    component.chatMessage = new ChatMessage();
    component.mouseDownHandler();
    expect(messagesService.selectMessage).toHaveBeenCalledWith(
      component.chatMessage
    );
  });

  it('should touchEnd if !mobileVersion', () => {
    const getMobileVersionSpy = jasmine.createSpy().and.returnValue(false);
    Object.defineProperty(component, 'mobileVersion', {
      get: getMobileVersionSpy,
    });
    component.touchStartHandler();
    expect(component['touchEnded']).toBeTruthy();
  });

  it('should !touchEnd if mobileVersion', () => {
    const getMobileVersionSpy = jasmine.createSpy().and.returnValue(true);
    Object.defineProperty(component, 'mobileVersion', {
      get: getMobileVersionSpy,
    });
    component.touchStartHandler();
    expect(component['touchEnded']).toBeFalsy();
  });

  it('should !timerElapsed if mobileVersion', () => {
    const getMobileVersionSpy = jasmine.createSpy().and.returnValue(true);
    Object.defineProperty(component, 'mobileVersion', {
      get: getMobileVersionSpy,
    });
    component.touchStartHandler();
    jasmine.clock().tick(150);
    expect(component['timeoutElapsed']).toBeFalsy();
  });

  it('should selected if mobileVersion', () => {
    const getMobileVersionSpy = jasmine.createSpy().and.returnValue(true);
    Object.defineProperty(component, 'mobileVersion', {
      get: getMobileVersionSpy,
    });
    component.selected = false;
    component.touchStartHandler();
    jasmine.clock().tick(150);
    expect(component.selected).toBeTruthy();
  });

  it('should call selectMessage if mobileVersion', () => {
    const getMobileVersionSpy = jasmine.createSpy().and.returnValue(true);
    Object.defineProperty(component, 'mobileVersion', {
      get: getMobileVersionSpy,
    });
    const someMessage = new ChatMessage();
    component.chatMessage = someMessage;
    component.touchStartHandler();
    jasmine.clock().tick(600);
    expect(messagesService.selectMessage).toHaveBeenCalledWith(someMessage);
  });

  it('touchEndHandler should clear selection', () => {
    Object.defineProperty(component, 'mobileVersion', {
      get: jasmine.createSpy().and.returnValue(true),
    });
    component.selected = true;
    component.touchEndHandler();
    expect(component.selected).toBeFalsy();
  });

  it('touchEndHandler should not clear selection', () => {
    Object.defineProperty(component, 'mobileVersion', {
      get: jasmine.createSpy().and.returnValue(false),
    });
    component.selected = true;
    component.touchEndHandler();
    expect(component.selected).toBeTruthy();
  });

  it('touchMoveHandler should clear selection', () => {
    Object.defineProperty(component, 'mobileVersion', {
      get: jasmine.createSpy().and.returnValue(true),
    });
    component.selected = true;
    component.touchMoveHandler();
    expect(component.selected).toBeFalsy();
  });

  it('touchMoveHandler should not clear selection', () => {
    Object.defineProperty(component, 'mobileVersion', {
      get: jasmine.createSpy().and.returnValue(false),
    });
    component.selected = true;
    component.touchMoveHandler();
    expect(component.selected).toBeTruthy();
  });
});
