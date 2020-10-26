import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { error } from 'protractor';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private authState: any;

  constructor(
    private afAuth: AngularFireAuth,
    private chatService: ChatService,
    private router: Router
  ) {
    this.user = afAuth.authState;
  }

  authUser() {
    return this.user;
  }

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(
      (resolve) => {
        const status = 'online';
        this.chatService.updateUser(this.authState.uid, status);
      },
      (error) => {
        throw new Error(error.message);
      }
    );
  }

  logout() {
    this.afAuth.auth.signOut().then(
      () => {
        this.user = null;
        const status = 'offline';
        this.chatService.updateUser(this.authState.uid, status);
      },
      (error) => {
        throw new Error(error.message);
      }
    );
  }

  signUp(email: string, password: string, displayName: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential: firebase.auth.UserCredential) => {
        this.authState = userCredential;
        const status = 'online';
        this.chatService.postUser(
          userCredential.user.uid,
          email,
          displayName,
          password,
          status
        ),
          (error) => {
            throw new Error(error.message);
          };
      });
  }
}
