import { createBrowserRouter, redirect } from 'react-router';
import Main from './layouts/Main';
import Login from './layouts/Login';
import ProjectPage from './pages/project';
import WorkPage from './pages/work';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Main,
    children: [
      {
        index: true,
        element: <ProjectPage />,
      },
      {
        path: 'project',
        element: <ProjectPage />
      },
      {
        path: 'work',
        element: <WorkPage />
      },
    ]
  },
  {
    path: '/login',
    Component: Login
  },
  // 404 页面
  {
    path: '*',
    element: <div>页面未找到</div>
  }
]);