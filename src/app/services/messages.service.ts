import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  selectedMessage: BehaviorSubject<ChatMessage> = new BehaviorSubject<
    ChatMessage
  >(null);
  repliedMessage: BehaviorSubject<ChatMessage> = new BehaviorSubject<
    ChatMessage
  >(null);

  constructor() {}

  selectMessage(message: ChatMessage): void {
    this.selectedMessage.next(message);
  }

  replyMessage(message: ChatMessage): void {
    this.repliedMessage.next(message);
  }
}
