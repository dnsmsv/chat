import { TestBed } from '@angular/core/testing';
import { Alert } from '../models/alert.model';
import { AlertType } from '../models/alert-type';

import { AlertService } from './alert.service';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#show should call next', () => {
    spyOn(service.alert, 'next');
    service.show('text', AlertType.Info);
    expect(service.alert.next).toHaveBeenCalledWith(
      new Alert('text', AlertType.Info, true)
    );
  });

  it('#show should hide in 10000 ms', () => {
    service.alert.next(new Alert('text', AlertType.Info, true));
    spyOn(service, 'hide');
    spyOn(service.alert, 'next');
    jasmine.clock().install();
    service.show('text', AlertType.Info);
    jasmine.clock().tick(10300);
    expect(service.hide).toHaveBeenCalled();
    jasmine.clock().uninstall();
  });

  it('#show should not hide in 10000 ms', () => {
    service.alert.next(new Alert('text', AlertType.Info, false));
    spyOn(service, 'hide');
    spyOn(service.alert, 'next');
    jasmine.clock().install();
    service.show('text', AlertType.Info);
    jasmine.clock().tick(10300);
    expect(service.hide).not.toHaveBeenCalled();
    jasmine.clock().uninstall();
  });

  it('#hide should not clearTimeout', () => {
    spyOn(window, 'clearTimeout');
    service.hide();
    expect(window.clearTimeout).not.toHaveBeenCalled();
  });

  it('#hide should turn visible to false', () => {
    service.alert.next(new Alert('text', AlertType.Info, true));
    spyOn(service.alert, 'next');
    service.hide();
    expect(service.alert.next).toHaveBeenCalledWith(
      new Alert('text', AlertType.Info, false)
    );
  });
});
