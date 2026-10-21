import type { RouteObject } from 'react-router';
import { AppShell } from '../components/shell/AppShell';
import { RequireRole } from './RequireRole';
import { Roles } from '../auth/roles';
import {
  AdminPage,
  ApprovalsPage,
  BrowsePage,
  MyTrainingsPage,
  NotFoundPage,
  TeachingPage,
} from '../pages';

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <BrowsePage /> },
      { path: 'my-trainings', element: <MyTrainingsPage /> },
      { path: 'approvals', element: <ApprovalsPage /> },
      {
        path: 'teaching',
        element: (
          <RequireRole roles={[Roles.Trainer, Roles.Admin]}>
            <TeachingPage />
          </RequireRole>
        ),
      },
      {
        path: 'admin',
        element: (
          <RequireRole roles={[Roles.Admin]}>
            <AdminPage />
          </RequireRole>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
