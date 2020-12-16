import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private _selectedMessage: BehaviorSubject<ChatMessage> = new BehaviorSubject<ChatMessage>(
    null
  );
  private _repliedMessage: BehaviorSubject<ChatMessage> = new BehaviorSubject<ChatMessage>(
    null
  );

  constructor() {}

  get selectedMessage(): Observable<ChatMessage> {
    return this._selectedMessage;
  }

  get repliedMessage(): Observable<ChatMessage> {
    return this._repliedMessage;
  }

  selectMessage(message: ChatMessage): void {
    this._selectedMessage.next(message);
  }

  replyMessage(message: ChatMessage): void {
    this._repliedMessage.next(message);
  }
}
