import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Dashboard from '../components/Dashboard';
import Patients from '../components/admin/Patients';
import Appointments from '../components/admin/Appointments';
import CalendarView from '../components/admin/CalendarView';
import LoginPage from '../pages/LoginPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: '/',
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: 'patients',
            element: <Patients />,
          },
          {
            path: 'appointments',
            element: <Appointments />,
          },
          {
            path: 'calendar',
            element: <CalendarView />,
          },
        ],
      },
    ],
  },
]);

export default router;