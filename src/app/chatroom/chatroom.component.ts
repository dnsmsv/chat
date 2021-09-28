import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatFormComponent } from '../chat-form/chat-form.component';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
})
export class ChatroomComponent implements OnInit, OnDestroy {
  @ViewChild('chatForm', { static: true, read: ChatFormComponent })
  private selectedMessageSubscription: Subscription;
  private repliedMessageSubscription: Subscription;
  manageMode: boolean = false;
  replyMode: boolean = false;

  constructor(private messagesService: MessagesService) {}

  ngOnInit(): void {
    this.selectedMessageSubscription =
      this.messagesService.selectedMessage.subscribe(
        (message) => (this.manageMode = message !== null)
      );
    this.repliedMessageSubscription =
      this.messagesService.repliedMessage.subscribe((message) => {
        this.replyMode = message !== null;
      });
  }

  ngOnDestroy(): void {
    if (this.selectedMessageSubscription)
      this.selectedMessageSubscription.unsubscribe();

    if (this.repliedMessageSubscription)
      this.repliedMessageSubscription.unsubscribe();
  }
}
