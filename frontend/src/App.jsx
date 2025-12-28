/**
 * 应用入口 / App Entry
 */

import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import router from './router';
import { themeConfig } from './styles/theme';
import './styles/global.css';

function App() {
  return (
    <ConfigProvider theme={themeConfig} locale={zhCN}>
      <Suspense fallback={<Spin size="large" />}>
        <RouterProvider router={router} />
      </Suspense>
    </ConfigProvider>
  );
}

export default App;
