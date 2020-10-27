import { Component, Input, OnInit } from '@angular/core';
import { StatusType } from '../models/statusType';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css'],
})
export class UserItemComponent implements OnInit {
  @Input() user: User;
  statusType = StatusType;

  constructor() {}

  ngOnInit(): void {}
}
