import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'crit', loadChildren: './crit/crit.module#CritPageModule' },
  { path: 'later', loadChildren: './later/later.module#LaterPageModule' },
  { path: 'done', loadChildren: './done/done.module#DonePageModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfilePageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'tos', loadChildren: './tos/tos.module#TosPageModule' },
  { path: 'privacy', loadChildren: './privacy/privacy.module#PrivacyPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
