import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertService } from '../services/alert.service';

import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  const alertService = jasmine.createSpyObj('alertService', ['hide']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [{ provide: AlertService, useValue: alertService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should hide', () => {
    component.hide();
    expect(alertService.hide).toHaveBeenCalled();
  });
});
