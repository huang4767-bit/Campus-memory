/**
 * 路由配置 / Router Configuration
 */

import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';

// 页面懒加载 / Lazy load pages
import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Circle = lazy(() => import('../pages/Circle'));
const Post = lazy(() => import('../pages/Post'));
const Profile = lazy(() => import('../pages/Profile'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'circle/:id', element: <Circle /> },
      { path: 'post/:id', element: <Post /> },
      { path: 'profile/:id', element: <Profile /> },
    ],
  },
]);

export default router;
