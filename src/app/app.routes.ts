import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Dashboard } from './components/dashboard/dashboard';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'   
  },
  {
    path: 'dashboard',    
    component: Dashboard,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'announcements',
        loadComponent: () =>
          import('./components/announcement/announcement-list/announcement-list')
            .then(m => m.AnnouncementListComponent)
      },
      {
        path: 'announcements/create',
        loadComponent: () =>
          import('./components/announcement/announcement-form/announcement-form')
            .then(m => m.AnnouncementFormComponent)
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./components/attendance/attendance')
            .then(m => m.AttendanceComponent)
      },
      {
        path: 'leaves',
        loadComponent: () =>
          import('./components/leave/leave')
            .then(m => m.LeaveComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/profile/profile')
            .then(m => m.ProfileComponent)
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./components/employees/employees')
            .then(m => m.EmployeesComponent)
      },
      { path: '', redirectTo: 'announcements', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login' }
];