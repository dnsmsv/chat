import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { messaging } from 'firebase';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatMessage } from '../models/chat-message.model';
import { ChatService } from '../services/chat.service';

import { FeedComponent } from './feed.component';

describe('FeedComponent', () => {
  let component: FeedComponent;
  let fixture: ComponentFixture<FeedComponent>;
  let chatService: ChatService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
      ],
      declarations: [FeedComponent],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();
    chatService = TestBed.inject(ChatService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should scroll bottom', () => {
    component.feed = [];
    component.ngAfterViewChecked();
    expect(component['scrolled']).toBeTruthy();
  });

  it('should init feed when feed is null', () => {
    const messages = [new ChatMessage()];
    chatService.chatMessages = new BehaviorSubject([]);
    component.feed = null;
    component.ngOnInit();
    chatService.chatMessages.next(messages);
    jasmine.clock().tick(300);
    expect(component.feed).toEqual(messages);
  });

  it('should init feed when feed and messages have different size', () => {
    const messages = [new ChatMessage()];
    chatService.chatMessages = new BehaviorSubject([]);
    component.feed = [new ChatMessage(), new ChatMessage()];
    component.ngOnInit();
    chatService.chatMessages.next(messages);
    jasmine.clock().tick(300);
    expect(component.feed).toEqual(messages);
  });
});
