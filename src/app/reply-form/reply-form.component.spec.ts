import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { MessagesService } from '../services/messages.service';

import { ReplyFormComponent } from './reply-form.component';

describe('ReplyFormComponent', () => {
  let component: ReplyFormComponent;
  let fixture: ComponentFixture<ReplyFormComponent>;
  const messagesService = jasmine.createSpyObj('messagesService', [
    'replyMessage',
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReplyFormComponent],
      providers: [{ provide: MessagesService, useValue: messagesService }],
    }).compileComponents();
  });

  beforeEach(() => {
    const getRepliedMessage = jasmine.createSpy().and.returnValue(of(null));
    Object.defineProperty(messagesService, 'repliedMessage', {
      get: getRepliedMessage,
      configurable: true,
    });
    fixture = TestBed.createComponent(ReplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create with replied message', () => {
    const getRepliedMessage = jasmine
      .createSpy()
      .and.returnValue(
        of(
          new ChatMessage(
            'name',
            'email',
            'message',
            new Date(1),
            true,
            'replied message'
          )
        )
      );
    Object.defineProperty(messagesService, 'repliedMessage', {
      get: getRepliedMessage,
    });
    fixture = TestBed.createComponent(ReplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.clock().install();
    jasmine.clock().tick(150);
    jasmine.clock().uninstall();
    expect(component.userName).toEqual('name');
    expect(component.timeStamp).toEqual(new Date(1));
    expect(component.messageContent).toEqual('message');
    expect(component.isOwn).toEqual(true);
  });

  it('#closeButtonHandler should call replyMessage', () => {
    component.closeButtonHandler();
    expect(messagesService.replyMessage).toHaveBeenCalledWith(null);
  });
});
