import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ChatFormComponent } from '../chat-form/chat-form.component';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
})
export class ChatroomComponent implements OnInit {
  @ViewChild('chatForm', { static: true, read: ChatFormComponent })
  private chatFormComponent: ChatFormComponent;
  manageMode: boolean = false;
  replyMode: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.redirect(this.authService.user.value);
    this.authService.user.subscribe((user) => {
      this.redirect(user);
    });
    this.messagesService.selectedMessage.subscribe(
      (message) => (this.manageMode = message !== null)
    );
    this.messagesService.repliedMessage.subscribe((message) => {
      this.replyMode = message !== null;
    });
  }

  public redirect(user) {
    // if (user === null) {
    //   this.router.navigate(['login']);
    // } else {
    //   this.router.navigate(['chat']);
    // }
  }
}
