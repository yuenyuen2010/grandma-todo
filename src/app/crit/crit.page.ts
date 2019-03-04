import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-crit',
  templateUrl: './crit.page.html',
  styleUrls: ['./crit.page.scss'],
})
export class CritPage implements OnInit {

  items = [{
    text: 'test',
    created: new Date(),
    pos: 0
  }];
  
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) { }

  ngOnInit() {
  }

}
