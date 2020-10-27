import { Injectable, Query } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message.model';
import { User } from '../models/user.model';
import { StatusType } from '../models/statusType';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  user: firebase.User;
  chatMessages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject([]);
  users: BehaviorSubject<User[]> = new BehaviorSubject([]);
  userName: string;
  private url = 'https://chat-d73d2.firebaseio.com';

  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe((auth) => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
        this.updateUser(StatusType.Online);
        this.getUser(this.user.uid).subscribe(
          (data: User) => {
            this.userName = data.name;
          },
          (error) => console.error('Error:', error)
        );

        this.getUsers();
        this.getMessages();
      } else if (this.user) {
        this.updateUser(StatusType.Offline);
        this.user = null;
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
      .post<ChatMessage>(`${this.url}/messages.json`, chatMessage, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .subscribe(
        (data) => {
          const newMessages = this.chatMessages.value;
          chatMessage.isOwn = true;
          newMessages.push(chatMessage);
          this.chatMessages.next(newMessages);
        },
        (error) => {
          throw new Error(error);
        }
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

  postUser(
    id: string,
    email: string,
    name: string,
    password: string,
    status: StatusType
  ): void {
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

  getUser(id: string): Observable<User> {
    return this.http.get(`${this.url}/users/${id}.json`, {
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  getUsers(): void {
    if (!this.user) {
      return;
    }

    this.http
      .get<User[]>(`${this.url}/users.json`, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .subscribe(
        (data: User[]) => {
          if (data) {
            const users = Reflect.ownKeys(data).map((key) => ({
              ...data[key],
            }));
            this.users.next(users);
          }
        },
        (error) => console.error('Error:', error)
      );
  }

  updateUser(status: StatusType): void {
    if (!this.user) return;

    const id: string = this.user.uid;
    this.http
      .patch(
        `${this.url}/users/${this.user.uid}.json`,
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
