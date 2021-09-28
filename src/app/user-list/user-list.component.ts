import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[];

  private subscription: Subscription;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.subscription = this.chatService.users.subscribe(
      (users) => (this.users = users)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
