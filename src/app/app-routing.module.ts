import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const AppRoute: Routes = [
    {
        path: "",
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)
    }
]