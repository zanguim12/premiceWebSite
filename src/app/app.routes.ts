import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.HomeComponent),
    title: 'Accueil - Premice Computer | Matériel Informatique Cameroun'
  },
//   {
//     path: 'products',
//     loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent),
//     title: 'Nos Produits - Premice Computer'
//   },
//   {
//     path: 'products/:slug',
//     loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
//     title: 'Détail Produit - Premice Computer'
//   },
//   {
//     path: 'cart',
//     loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
//     title: 'Panier - Premice Computer'
//   },
//   {
//     path: 'checkout',
//     loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
//     title: 'Commande - Premice Computer'
//   },
//   {
//     path: 'about',
//     loadComponent: () => import('./features/pages/about/about.component').then(m => m.AboutComponent),
//     title: 'À Propos - Premice Computer'
//   },
//   {
//     path: 'contact',
//     loadComponent: () => import('./features/pages/contact/contact.component').then(m => m.ContactComponent),
//     title: 'Contact - Premice Computer'
//   },
  // {
  //   path: '**',
  //   redirectTo: '',
  //   pathMatch: 'full'
  // }
];