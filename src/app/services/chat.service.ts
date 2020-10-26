import { Injectable, Query } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  user: firebase.User;
  chatMessages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject([]);
  users: BehaviorSubject<User[]> = new BehaviorSubject([]);
  userName: string;
  private url = 'https://chat-d73d2.firebaseio.com';

  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe((auth) => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;

        this.getUser(this.user.uid).subscribe(
          (data: User) => {
            this.userName = data.name;
          },
          (error) => console.error('Error:', error)
        );

        this.getMessages();
      }
    });
  }

  postMessage(msg: string) {
    const email = this.user.email;
    const chatMessage: ChatMessage = new ChatMessage(
      this.userName,
      email,
      msg,
      new Date(Date.now()),
      null
    );
    this.http
      .post(`${this.url}/messages.json`, chatMessage, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .subscribe(
        () => {
          const newMessages = this.chatMessages.value;
          chatMessage.isOwn = true;
          newMessages.push(chatMessage);
          this.chatMessages.next(newMessages);
        },
        (error) => console.error('Error:', error)
      );
  }

  getMessages(): void {
    if (!this.user) {
      return;
    }

    this.http
      .get<ChatMessage[]>(`${this.url}/messages.json`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .subscribe(
        (data: ChatMessage[]) => {
          if (data) {
            const messages = Reflect.ownKeys(data).map((key) => ({
              ...data[key],
              isOwn: data[key].email === this.user.email,
            }));
            this.chatMessages.next(messages);
          }
        },
        (error) => console.error('Error:', error)
      );
  }

  getUser(id: string): Observable<User> {
    return this.http.get(`${this.url}/users/${id}.json`, {
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  postUser(
    id: string,
    email: string,
    name: string,
    password: string,
    status: string
  ): void {
    console.log('post=', id);

    const user: User = new User(id, email, name, password, status);
    this.http
      .put(`${this.url}/users/${id}.json`, user, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .subscribe(
        () => {
          const newUsers = this.users.value;
          newUsers.push(user);
          this.users.next(newUsers);
        },
        (error) => console.error('Error:', error)
      );
  }

  updateUser(id: string, status: string): void {
    this.http
      .patch(
        `${this.url}/users/${id}.json`,
        {
          status: status,
        },
        {
          headers: {
            'content-type': 'application/json',
          },
        }
      )
      .subscribe(
        () => {
          const user: User = this.users.value.find((u) => u.id === id);

          if (user) {
            user.status = status;
            this.users.next(this.users.value);
          }
        },
        (error) => console.error('Error:', error)
      );
  }
}
