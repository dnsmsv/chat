import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
})
export class ChatroomComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroller') private feedContainer: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.user) {
      this.router.navigate(['login']);
    }
  }

  scrollToBottom(): void {
    this.feedContainer.nativeElement.scrollTop = this.feedContainer.nativeElement.scrollHeight;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
}
