import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertType } from '../models/alert-type';
import { ChatMessage } from '../models/chat-message.model';
import { AlertService } from '../services/alert.service';
import { ChatService } from '../services/chat.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css'],
})
export class ChatFormComponent implements OnInit, OnDestroy {
  @ViewChild('chatInput') private chatInput: ElementRef;
  message: string = '';
  replyedMessageKey: string;

  private subscription: Subscription;

  constructor(
    private alertService: AlertService,
    private chatService: ChatService,
    private messagesService: MessagesService
  ) {
    this.subscription = this.messagesService.repliedMessage.subscribe(
      (message) => {
        if (message !== null) {
          this.replyedMessageKey = message.$key;

          setTimeout(() => {
            this.chatInput.nativeElement.focus();
          }, 300);
        }
      }
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  send() {
    try {
      this.chatService.postMessage(this.message, this.replyedMessageKey);
    } catch (error) {
      this.alertService.show(error.message, AlertType.Error);
    }

    this.message = '';
    this.replyedMessageKey = null;
    this.messagesService.replyMessage(null);
  }

  handleSubmit(event) {
    if (event.keyCode === 13 && this.message?.trim()) {
      this.send();
    }
  }
}
