import { Component, OnChanges, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  feed: ChatMessage[];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.chatMessages.subscribe(
      (messages) => (this.feed = messages)
    );
  }
}
