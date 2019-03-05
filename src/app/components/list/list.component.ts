import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { forkJoin } from 'rxjs';

const MAX_LIST_SIZE = 100;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  items = [];
  @Input('title') title: string;
  @Input('name') name: string;
  @Input('allowDone') allowDone: boolean;
  @Input('allowCrit') allowCrit: boolean;
  @Input('allowLater') allowLater: boolean;
  loading = true;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore,
    private alertCtrl: AlertController, ) {
  }

  ngOnInit() {
    console.log(this.name);

    this.afAuth.authState.subscribe(user => {
      if (!user)
        return;

      console.log(`users/${this.afAuth.auth.currentUser.uid}/${this.name}`);

      this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/${this.name}`, ref => {
        let query = ref.orderBy('pos', 'desc');
        query = query.limit(MAX_LIST_SIZE);
        return query;
      }).snapshotChanges().subscribe(colSnap => {
        this.items = [];
        console.log(colSnap.length);
        colSnap.forEach(a => {
          let item = a.payload.doc.data();
          item['id'] = a.payload.doc.id;
          this.items.push(item);
        });
        this.loading = false;
      });
    });
  }

  async add() {
    this.addOrEdit('New Task', val => this.handleAddItem(val.task));
  }

  async edit(item) {
    this.addOrEdit('Edit Task', val => this.handleEditItem(val.task, item), item);
  }

  async addOrEdit(header, handler, item?) {
    //Prompt alert box and let user to input the task name
    const alert = await this.alertCtrl.create({
      header,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler,
        }
      ],
      inputs: [
        {
          name: 'task',
          type: 'text',
          placeholder: 'My task',
          value: item ? item.text : '',
        },
      ],
    });

    await alert.present();
    alert.getElementsByTagName('input')[0].focus();

    //Listen to keyboard event
    alert.addEventListener('keydown', (val => {
      //For pressing 'Enter'
      if (val.keyCode === 13) {
        handler({ task: val.srcElement['value'] });
        alert.dismiss();
      }
    }));
  }

  async handleAddItem(text: string) {

    if (!text.trim().length)
      return;

    let now = new Date();
    let nowUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(),
      now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));

    try {
      //Add record to Firestore
      await this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/${this.name}`).add({
        text,
        pos: this.items.length ? this.items[0].pos + 1 : 0,
        created: nowUtc,
      });

      //Show alert if too many record
      if (this.items.length >= MAX_LIST_SIZE) {
        let warning = await this.alertCtrl.create({
          header: 'Critical Oveload',
          subHeader: 'Too many important items!',
          message: `You have over ${MAX_LIST_SIZE} items in this list, only showing the top ${MAX_LIST_SIZE}.`,
          buttons: ['Okay'],
        });
        warning.present();
      }

    } catch (err) {
      console.log(err);
    }
  }

  handleEditItem(text: string, item) {

    this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/${this.name}/${item.id}`).set({
      text,
    }, { merge: true });
  }

  delete(item) {
    this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/${this.name}/${item.id}`).delete();
  }

  crit(item) {
    this.moveItem(item, 'crit');
  }

  complete(item) {
    this.moveItem(item, 'done');
  }

  later(item) {
    this.moveItem(item, 'later');
  }

  async moveItem(item, list: string) {
    console.log(`moving ${item.id} from ${this.name} to ${list}`);

    //XXX: no need to use await here? How to handle exceptions for this 'delete' action? 
    this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/${this.name}/${item.id}`).delete();

    let id = item.id;
    delete item.id;

    try {
      //Get max pos from the target list
      let qSnap = await this.db.collection(`users/${this.afAuth.auth.currentUser.uid}/${list}`, ref => {
        return ref.orderBy('pos', 'desc').limit(1);
      }).get().toPromise();

      //Set pos to item
      item.pos = 0;
      qSnap.forEach(a => {
        item.pos = a.data().pos + 1;
      });

      //Insert item into the target list
      await this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/${list}/${id}`).set(item);
    } catch (err) {
      console.log(err);
    }
  }

  async moveByOffset(index, offset) {
    //Setup the functions that use to update the records
    let first = this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/${this.name}/${this.items[index].id}`).set({
      pos: this.items[index + offset].pos
    }, { merge: true });
    let second = this.db.doc(`users/${this.afAuth.auth.currentUser.uid}/${this.name}/${this.items[index + offset].id}`).set({
      pos: this.items[index].pos
    }, { merge: true })

    //Promise.all version
    //Async update 2 recrods concurrently
    try {
      await Promise.all([first, second]);
    } catch (err) {
      console.log(err);
    }

    //forkjoin version
    /*
    forkJoin(first, second).subscribe(
      result => {
        console.log(result);
      },
      err => {
        console.log(err);
      },
      () => {
        console.log('Completed!');
      }
    )
    */
  }
}