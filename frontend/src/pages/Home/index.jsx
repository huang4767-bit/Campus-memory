/**
 * 首页 / Home Page
 */

import { useState, useEffect } from 'react';
import { Tabs, Spin, Empty, theme } from 'antd';
import PostCard from '../../components/PostCard';
import { getFeed } from '../../services/post';
import { togglePostLike, togglePostFavorite } from '../../services/interaction';

const Home = () => {
  const { token } = theme.useToken();
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async (pageNum = 1) => {
    setLoading(true);
    const res = await getFeed({ page: pageNum, page_size: 20 });
    if (res?.code === 200) {
      const newPosts = res.data?.results || [];
      setPosts(pageNum === 1 ? newPosts : [...posts, ...newPosts]);
      setHasMore(newPosts.length === 20);
      setPage(pageNum);
    }
    setLoading(false);
  };

  // 点赞 / Like
  const handleLike = async (postId) => {
    const res = await togglePostLike(postId);
    if (res?.code === 200) {
      setPosts(posts.map(p =>
        p.id === postId
          ? { ...p, is_liked: res.data.liked, like_count: p.like_count + (res.data.liked ? 1 : -1) }
          : p
      ));
    }
  };

  // 收藏 / Favorite
  const handleFavorite = async (postId) => {
    const res = await togglePostFavorite(postId);
    if (res?.code === 200) {
      setPosts(posts.map(p =>
        p.id === postId ? { ...p, is_favorited: res.data.favorited } : p
      ));
    }
  };

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

      {loading && posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: token.paddingLG * 3 }}>
          <Spin size="large" />
        </div>
      ) : posts.length === 0 ? (
        <Empty
          description="暂无动态，快去加入圈子吧"
          style={{ padding: token.paddingLG * 3 }}
        />
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onFavorite={handleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
