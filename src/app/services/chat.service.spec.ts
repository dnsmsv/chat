import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from 'src/environments/environment';
import { StatusType } from '../models/status-type';
import { User } from '../models/user.model';

import { ChatService } from './chat.service';
import { of, throwError } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

describe('ChatService', () => {
  let service: ChatService;
  let afAuth: AngularFireAuth;
  // const http = jasmine.createSpyObj('http', [
  //   'post',
  //   'get',
  //   'delete',
  //   'put',
  //   'patch',
  // ]);
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        HttpClientTestingModule,
      ],
      // providers: [{ provide: HttpClient, useValue: http }, HttpHandler],
    });
    service = TestBed.inject(ChatService);
    afAuth = TestBed.inject(AngularFireAuth);
    httpMock = TestBed.inject(HttpTestingController);
    // http.post.calls.reset();
    // http.get.calls.reset();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    spyOn(service, 'getUser').and.returnValue(of(undefined));
    expect(service).toBeTruthy();
  });

  it('#init should updateUser after autherization', () => {
    Object.defineProperty(afAuth, 'authState', {
      get: jasmine.createSpy().and.returnValue(
        of({
          uid: 'some id',
        })
      ),
    });
    spyOn(service, 'getUser').and.returnValue(of(new User()));
    const updateUserSpy = spyOn(service, 'updateUser');
    spyOn(service, 'getUsers');
    spyOn(service, 'getMessages');
    service.init();
    expect(updateUserSpy).toHaveBeenCalledWith(StatusType.Online);
  });

  it('#init should write error to console after autherization', () => {
    Object.defineProperty(afAuth, 'authState', {
      get: jasmine.createSpy().and.returnValue(
        of({
          uid: 'some id',
        })
      ),
    });
    spyOn(service, 'getUser').and.returnValue(throwError('some error'));
    const consoleErrorSpy = spyOn(console, 'error');
    spyOn(service, 'getUsers');
    spyOn(service, 'getMessages');
    service.init();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('#init should not updateUser if getUser returns null', () => {
    Object.defineProperty(afAuth, 'authState', {
      get: jasmine.createSpy().and.returnValue(
        of({
          uid: 'some id',
        })
      ),
    });
    spyOn(service, 'getUser').and.returnValue(of(undefined));
    const updateUserSpy = spyOn(service, 'updateUser');
    spyOn(service, 'getUsers');
    spyOn(service, 'getMessages');
    service.init();
    expect(updateUserSpy).not.toHaveBeenCalled();
  });

  it('#init should updateUser to Offline if user is not authorizized', () => {
    Object.defineProperty(afAuth, 'authState', {
      get: jasmine.createSpy().and.returnValue(of(undefined)),
    });
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue({
        uid: 'some id',
      }),
    });
    spyOn(service, 'getUser').and.returnValue(of(new User()));
    const updateUserSpy = spyOn(service, 'updateUser');
    spyOn(service, 'getUsers');
    spyOn(service, 'getMessages');
    service.init();
    expect(updateUserSpy).toHaveBeenCalledWith(StatusType.Offline);
  });

  it('#init should not updateUser to Offline if user is not authorizized and getUser reurnes undefined', () => {
    Object.defineProperty(afAuth, 'authState', {
      get: jasmine.createSpy().and.returnValue(of(undefined)),
    });
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue({
        uid: 'some id',
      }),
    });
    spyOn(service, 'getUser').and.returnValue(of(undefined));
    const updateUserSpy = spyOn(service, 'updateUser');
    spyOn(service, 'getUsers');
    spyOn(service, 'getMessages');
    service.init();
    expect(updateUserSpy).not.toHaveBeenCalledWith(StatusType.Offline);
  });

  it('#init should throw error if user is not authorizized', () => {
    Object.defineProperty(afAuth, 'authState', {
      get: jasmine.createSpy().and.returnValue(of(undefined)),
    });
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue({
        uid: 'some id',
      }),
    });
    spyOn(service, 'getUser').and.returnValue(throwError('some error'));
    const consoleErrorSpy = spyOn(console, 'error');
    service.init();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('#postMessage should not call post', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue(undefined),
    });
    Object.defineProperty(service, 'chatMessages', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          $key: 'key',
          isOwn: true,
          push: jasmine.createSpy('push'),
        },
        next: jasmine.createSpy('next'),
      }),
    });
    service.postMessage('message', 'key');
    expect(service.chatMessages.next).not.toHaveBeenCalled();
  });

  it('#post message should call post ', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue({
        email: 'some email',
      }),
    });
    service.userName = 'some user name';
    Object.defineProperty(service, 'chatMessages', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          $key: 'key',
          isOwn: true,
          push: jasmine.createSpy('push'),
        },
        next: jasmine.createSpy('next'),
      }),
    });
    service.postMessage('message', 'key');
    const req = httpMock.expectOne(`${service.url}/messages.json`);
    expect(req.request.method).toBe('POST');
    req.flush({ name: 'some name' });
    expect(service.chatMessages.next).toHaveBeenCalled();
  });

  it('#getMessages should not call http.get if user is null', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue(null),
    });
    spyOn(service.chatMessages, 'next');
    service.getMessages();
    expect(service.chatMessages.next).not.toHaveBeenCalled();
  });

  it('#getMessages should call chatMessages.next if user is not null and subscribe data is not undefined', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue('some user'),
    });
    const data = [];
    spyOn(service.chatMessages, 'next');
    service.getMessages();
    const req = httpMock.expectOne(`${service.url}/messages.json`);
    expect(req.request.method).toBe('GET');
    req.flush(data);
    expect(service.chatMessages.next).toHaveBeenCalled();
  });

  it('#getMessages should not call chatMessages.next if user is not null and subscribe data is null', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue('some user'),
    });
    spyOn(service.chatMessages, 'next');
    service.getMessages();
    const req = httpMock.expectOne(`${service.url}/messages.json`);
    expect(req.request.method).toBe('GET');
    req.flush(null);
    expect(service.chatMessages.next).not.toHaveBeenCalled();
  });

  it('#getMessages should call console.error if user is not null and subscribe throw error', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue('some user'),
    });
    const consoleErrorSpy = spyOn(console, 'error');
    service.getMessages();
    const req = httpMock.expectOne(`${service.url}/messages.json`);
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('network error'));
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('#getMessage should call find if chatMessages is defined', () => {
    const message = new ChatMessage();
    message.$key = 'some key';
    const anotherMessage = new ChatMessage();
    anotherMessage.$key = 'another key';
    Object.defineProperty(service, 'chatMessages', {
      get: jasmine.createSpy().and.returnValue({
        value: [message, anotherMessage],
      }),
    });
    spyOn(service, 'getUsers');
    spyOn(service, 'getMessages');
    const result: ChatMessage = service.getMessage('some key');
    expect(result).toEqual(message);
  });

  it('#getMessage should not call find if chatMessages is undefined', () => {
    Object.defineProperty(service, 'chatMessages', {
      get: jasmine.createSpy().and.returnValue(undefined),
    });
    const result: ChatMessage = service.getMessage('some key');
    expect(result).toBeNull();
  });

  it('#removeMessage should call chatMessages.next if subscribe data is defined', () => {
    const message = new ChatMessage();
    message.$key = 'key';
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue({
        email: 'some email',
      }),
    });
    Object.defineProperty(service, 'chatMessages', {
      get: jasmine.createSpy().and.returnValue({
        value: [new ChatMessage()],
        next: jasmine.createSpy('next'),
      }),
    });
    service.removeMessage(message);
    const req = httpMock.expectOne(
      `${service.url}/messages/${message.$key}.json`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
    expect(service.chatMessages.next).toHaveBeenCalled();
  });

  it('#removeMessage should call console.error if delete error', () => {
    const message = new ChatMessage();
    message.$key = 'key';
    spyOn(console, 'error');
    service.removeMessage(message);
    const req = httpMock.expectOne(
      `${service.url}/messages/${message.$key}.json`
    );
    expect(req.request.method).toBe('DELETE');
    req.error(new ErrorEvent('some error'));
    expect(console.error).toHaveBeenCalled();
  });

  it('#postUser should call users.next if there is no errors', () => {
    spyOn(service.users, 'next');
    service.postUser(
      'some id',
      'some email',
      'some name',
      'some password',
      StatusType.Online
    );
    const request = httpMock.expectOne(
      `${service.url}/users/${'some id'}.json`
    );
    expect(request.request.method).toBe('PUT');
    request.flush({});
    expect(service.users.next).toHaveBeenCalled();
  });

  it('#postUser should call console.error if there are errors', () => {
    spyOn(console, 'error');
    service.postUser(
      'some id',
      'some email',
      'some name',
      'some password',
      StatusType.Online
    );
    const request = httpMock.expectOne(
      `${service.url}/users/${'some id'}.json`
    );
    expect(request.request.method).toBe('PUT');
    request.error(new ErrorEvent('some error'));
    expect(console.error).toHaveBeenCalled();
  });

  it('#getUsers should not call next if user is null', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue(null),
    });
    const nextSpy = spyOn(service.users, 'next');
    service.getUsers();
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it('#getUsers should call next if user is not null', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue('some user'),
    });
    const nextSpy = spyOn(service.users, 'next');
    service.getUsers();
    const request = httpMock.expectOne(`${service.url}/users.json`);
    expect(request.request.method).toBe('GET');
    request.flush([]);
    expect(nextSpy).toHaveBeenCalled();
  });

  it('#getUsers should not call next if data is null', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue('some user'),
    });
    const nextSpy = spyOn(service.users, 'next');
    service.getUsers();
    const request = httpMock.expectOne(`${service.url}/users.json`);
    expect(request.request.method).toBe('GET');
    request.flush(null);
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it('#getUsers should call console.error if there is errors', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue('some user'),
    });
    const consoleErrorSpy = spyOn(console, 'error');
    service.getUsers();
    const request = httpMock.expectOne(`${service.url}/users.json`);
    expect(request.request.method).toBe('GET');
    request.error(new ErrorEvent('some error'));
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('#updateUser should not call getUser if user is null', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue(null),
    });
    const getUserSpy = spyOn(service, 'getUser');
    service.updateUser(StatusType.Online);
    expect(getUserSpy).not.toHaveBeenCalled();
  });

  it('#updateUser should call getUser if user is not null', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue({
        uid: 'some id',
      }),
    });
    const getUserSpy = spyOn(service, 'getUser').and.returnValue(of(undefined));
    service.updateUser(StatusType.Online);
    expect(getUserSpy).toHaveBeenCalled();
  });

  it('#updateUser should call find if user is not null and getUser returns not null', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue({
        uid: 'some id',
      }),
    });
    const getUserSpy = spyOn(service, 'getUser').and.returnValue(
      of(new User())
    );
    Object.defineProperty(service, 'users', {
      get: jasmine.createSpy().and.returnValue({
        value: {
          find: jasmine.createSpy('find').and.returnValue(null),
        },
      }),
    });
    service.updateUser(StatusType.Online);
    const request = httpMock.expectOne(
      `${service.url}/users/${'some id'}.json`
    );
    expect(request.request.method).toBe('PATCH');
    request.flush({});
    expect(service.users.value.find).toHaveBeenCalled();
  });

  it('#updateUser should call next if user is not null and getUser returns not null', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue({
        uid: 'some id',
      }),
    });
    const getUserSpy = spyOn(service, 'getUser').and.returnValue(
      of(new User())
    );
    Object.defineProperty(service.users, 'value', {
      get: jasmine.createSpy().and.returnValue([new User('some id')]),
    });
    const nextSpy = spyOn(service.users, 'next');
    service.updateUser(StatusType.Online);
    const request = httpMock.expectOne(
      `${service.url}/users/${'some id'}.json`
    );
    expect(request.request.method).toBe('PATCH');
    request.flush({});
    expect(nextSpy).toHaveBeenCalled();
  });

  it('#updateUser should call console.error if user is not null and patch returns errors', () => {
    Object.defineProperty(service, 'user', {
      get: jasmine.createSpy().and.returnValue({
        uid: 'some id',
      }),
    });
    const getUserSpy = spyOn(service, 'getUser').and.returnValue(
      of(new User())
    );
    const consoleErrorSpy = spyOn(console, 'error');
    service.updateUser(StatusType.Online);
    const request = httpMock.expectOne(
      `${service.url}/users/${'some id'}.json`
    );
    expect(request.request.method).toBe('PATCH');
    request.error(new ErrorEvent('some error'));
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
