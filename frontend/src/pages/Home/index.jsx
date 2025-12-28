/**
 * 首页 / Home Page
 */

import { useState } from 'react';
import { Tabs, theme } from 'antd';
import PostCard from '../../components/PostCard';

const Home = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { token } = theme.useToken();

  // 模拟数据 / Mock data
  const mockPosts = [
    {
      id: 1,
      author: { username: 'zhangsan', real_name: '张三' },
      content: '今天回母校看了看，变化好大！操场翻新了，教学楼也重新粉刷过。',
      circle: { name: 'XX中学2020届' },
      like_count: 128,
      comment_count: 12,
      created_at: new Date().toISOString(),
    },
  ];

  const tabItems = [
    { key: 'all', label: '全部' },
    { key: 'circles', label: '我的圈子' },
    { key: 'following', label: '关注' },
  ];

  const styles = {
    page: {
      minHeight: '100vh',
    },
    header: {
      position: 'sticky',
      top: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      padding: token.padding,
      borderBottom: `1px solid ${token.colorBorder}`,
      zIndex: 10,
    },
    title: {
      fontSize: token.fontSizeXL,
      fontWeight: 800,
    },
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>首页</h1>
      </header>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        centered
      />

      <div>
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
