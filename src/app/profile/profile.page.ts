import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any = {};

  constructor(
    private afAuth: AngularFireAuth,
    public loadingController: LoadingController
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
      }
    })
  }

  ngOnInit() {
  }

  async signOut() {
    let loading: HTMLIonLoadingElement;

    //AC. show loading bar
    loading = await this.presentLoading();  

    //AC. logout firestore
    await this.afAuth.auth.signOut(); 

    //dismiss loading bar
    this.dismissLoading(loading); 

    //reload current page
    location.reload();  
  }

  //async function must return 'Promise' type
  async presentLoading(): Promise<HTMLIonLoadingElement> {  
    const loading = await this.loadingController.create({
      message: 'Hellooo',
    });
    await loading.present();

    return loading;
  }

  dismissLoading(loading) {
    loading.dismiss();
    console.log('Loading dismissed!');
  }
}