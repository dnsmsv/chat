import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { StatusType } from '../models/statusType';
import { ChatService } from './chat.service';

@Injectable()
export class AuthService {
  private _user: BehaviorSubject<firebase.User> = new BehaviorSubject(null);

  constructor(
    private afAuth: AngularFireAuth,
    private chatService: ChatService
  ) {
    afAuth.authState.subscribe((state: firebase.User) => {
      this._user.next(state);
    });
  }

  get user() {
    return this._user;
  }

  login(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.user.next(userCredential.user);
      });
  }

  logout() {
    return this.afAuth.auth.signOut().then(() => {
      if (this.user.value) {
        this.user.next(null);
      }
    });
  }

  signUp(email: string, password: string, displayName: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this._user.next(userCredential.user);
        this.chatService.postUser(
          userCredential.user.uid,
          email,
          displayName,
          password,
          StatusType.Online
        );
      });
  }
}
