import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-message-date',
  templateUrl: './message-date.component.html',
  styleUrls: ['./message-date.component.css'],
})
export class MessageDateComponent implements OnInit {
  @Input() date: Date;
  today: Date = new Date(Date.now());

  constructor() {}

  ngOnInit(): void {}
}
