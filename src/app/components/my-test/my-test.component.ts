import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-my-test',
  templateUrl: './my-test.component.html',
  styleUrls: ['./my-test.component.scss'],
})
export class MyTestComponent implements OnInit {
  @Input('title') title: string;
  @Output('add') add = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

}
