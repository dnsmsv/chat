import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';

import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#selectMessage should call next', () => {
    const nextSpy = spyOn(
      service.selectedMessage as BehaviorSubject<ChatMessage>,
      'next'
    );
    service.selectMessage(new ChatMessage());
    expect(nextSpy).toHaveBeenCalled();
  });

  it('#replyMessage should call next', () => {
    const nextSpy = spyOn(
      service.repliedMessage as BehaviorSubject<ChatMessage>,
      'next'
    );
    service.replyMessage(new ChatMessage());
    expect(nextSpy).toHaveBeenCalled();
  });
});
