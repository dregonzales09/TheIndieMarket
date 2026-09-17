import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/signup/signup.component').then(m => m.SignupComponent) 
  },
  { 
    path: 'games', 
    loadComponent: () => import('./components/game-selection/game-selection.component').then(m => m.GameSelectionComponent) 
  },
  { 
    path: 'market', 
    loadComponent: () => import('./components/marketplace/marketplace.component').then(m => m.MarketplaceComponent) 
  },
  { path: '**', redirectTo: '' }
];
