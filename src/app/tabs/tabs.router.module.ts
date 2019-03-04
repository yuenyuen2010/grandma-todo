import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'crit',
        children: [
          {
            path: '',
            loadChildren: '../crit/crit.module#CritPageModule'
          }
        ]
      },
      {
        path: 'later',
        children: [
          {
            path: '',
            loadChildren: '../later/later.module#LaterPageModule'
          }
        ]
      },
      {
        path: 'done',
        children: [
          {
            path: '',
            loadChildren: '../done/done.module#DonePageModule'
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: '../profile/profile.module#ProfilePageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/crit',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/crit',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
