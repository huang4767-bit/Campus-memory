/**
 * 布局组件 / Layout Component
 */

import { Suspense, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Spin, theme } from 'antd';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import { getProfile } from '../../services/user';

const Layout = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  // 检查用户是否已完善资料 / Check if profile is complete
  useEffect(() => {
    const checkProfile = async () => {
      // 未登录则跳转登录页 / Redirect to login if not logged in
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const res = await getProfile();
      if (res?.code === 0 && !res.data.is_profile_complete) {
        navigate('/profile/complete');
      }
      setChecking(false);
    };

    checkProfile();
  }, [navigate]);

  // 检查中显示加载 / Show loading while checking
  if (checking) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const styles = {
    layout: {
      display: 'flex',
      minHeight: '100vh',
      maxWidth: 1280,
      margin: '0 auto',
    },
    sidebar: {
      width: 275,
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      padding: token.paddingXS,
      borderRight: `1px solid ${token.colorBorder}`,
    },
    main: {
      flex: 1,
      maxWidth: 600,
      minHeight: '100vh',
      borderRight: `1px solid ${token.colorBorder}`,
    },
    right: {
      width: 350,
      flexShrink: 0,
      padding: token.paddingSM,
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 200,
    },
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <Sidebar />
      </aside>

      <main style={styles.main}>
        <Suspense fallback={<div style={styles.loading}><Spin size="large" /></div>}>
          <Outlet />
        </Suspense>
      </main>

      <aside style={styles.right}>
        <RightSidebar />
      </aside>
    </div>
  );
};

export default Layout;
