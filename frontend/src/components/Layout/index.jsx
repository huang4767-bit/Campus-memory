/**
 * 布局组件 / Layout Component
 */

import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Spin, theme } from 'antd';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

const Layout = () => {
  const { token } = theme.useToken();

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
