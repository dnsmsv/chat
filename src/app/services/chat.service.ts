import { Injectable, Query } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import {AngularFireAuth} from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message.model';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: any
  chatMessages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject([]);
  userName: Observable<string> = new Observable<string>();
  private name: string;
  private url = 'https://chat-d73d2.firebaseio.com';

  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) { 
    // this.afAuth.authState.subscribe(auth => {
    //   if (auth !== undefined && auth !== null) {
    //     this.user = auth;
    //   }
    // })
    this.userName.subscribe(n => {
      this.name = n
    })
  }

  sendMessage(msg: string) {
    // const email = this.user.email;
    const email = 'test@example.com';
    const chatMessage: ChatMessage = new ChatMessage(
      'test-user', email, msg, new Date(Date.now())
    )
    this.http.post(`${this.url}/message.json`, chatMessage, {
      headers: {
        'content-type': 'application/json'
      }
    }).subscribe(
      () => {
        const newMessages = this.chatMessages.value;
        newMessages.push(chatMessage);
        this.chatMessages.next(newMessages);
      },
      error => console.error('Error:', error)
    );
  }

  loadMessages(): void {
    this.http.get<ChatMessage[]>(`${this.url}/message.json`, {
      headers: {
        'content-type': 'application/json'
      }
    }).subscribe(
      (data: ChatMessage[]) => {
        const messages = Reflect.ownKeys(data).map(key => ({ ...data[key] }));
        this.chatMessages.next(messages)
      },
      error => console.error('Error:', error))
  }

  // getTimeStamp() {
  //   const now = new Date();
  //   const date = now.getUTCFullYear() + '/' +
  //                (now.getUTCMonth() + 1) + '/' + 
  //                now.getUTCDate();
  //   const time = now.getUTCHours() + ':' +
  //                now.getUTCMinutes() + ':' +
  //                now.getUTCSeconds();
  //   return (date + ' ' + time);
  // }
}
