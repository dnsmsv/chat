import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ChatMessage } from '../models/chat-message.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit, AfterViewChecked, OnDestroy {
  feed: ChatMessage[];
  private scrolled: boolean = false;
  private subscription: Subscription;
  @ViewChild('scroller') private feedContainer: ElementRef;

  constructor(private chatService: ChatService) {}

  ngAfterViewChecked(): void {
    if (this.feed && !this.scrolled) {
      this.scrollToBottom();
      this.scrolled = true;
    }
  }

  ngOnInit(): void {
    this.subscription = this.chatService.chatMessages.subscribe((messages) => {
      if (
        messages &&
        messages.length &&
        (!this.feed || messages.length != this.feed.length)
      ) {
        this.feed = messages;
        this.scrolled = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private scrollToBottom(): void {
    this.feedContainer.nativeElement.scrollTop =
      this.feedContainer.nativeElement.scrollHeight;
  }
}
