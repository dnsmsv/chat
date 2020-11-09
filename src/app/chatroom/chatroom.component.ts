import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
})
export class ChatroomComponent implements OnInit {
  manageMode: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messagesService: MessagesService
  ) {
    messagesService.selectedMessage.subscribe(
      (message) => (this.manageMode = message !== null)
    );
  }

  ngOnInit(): void {
    this.redirect(this.authService.user.value);
    this.authService.user.subscribe((user) => {
      this.redirect(user);
    });
  }

  private redirect(user) {
    if (user === null) {
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['chat']);
    }
  }
}
