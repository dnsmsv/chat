import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../models/chat-message.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit, AfterViewChecked {
  feed: ChatMessage[];
  private scrolled: boolean = false;
  @ViewChild('scroller') private feedContainer: ElementRef;

  constructor(private chatService: ChatService) {}
  ngAfterViewChecked(): void {
    if (this.feed && !this.scrolled) {
      this.scrollToBottom();
      this.scrolled = true;
    }
  }

  ngOnInit(): void {
    this.chatService.chatMessages.subscribe((messages) => {
      if (messages && messages.length) {
        this.feed = messages;
        this.scrolled = false;
      }
    });
  }

  scrollToBottom(): void {
    this.feedContainer.nativeElement.scrollTop = this.feedContainer.nativeElement.scrollHeight;
  }
}
