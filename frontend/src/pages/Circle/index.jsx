/**
 * 圈子详情页 / Circle Detail Page
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme, Button, Tabs, Spin, Empty, message } from 'antd';
import { ArrowLeftOutlined, TeamOutlined, EditOutlined } from '@ant-design/icons';
import PostCard from '../../components/PostCard';
import CreatePostModal from './CreatePostModal';
import {
  getCircleDetail,
  joinCircle,
  leaveCircle,
  getCirclePosts,
  togglePostLike,
  togglePostFavorite,
} from '../../services';

const Circle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const [circle, setCircle] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 加载圈子详情 / Load circle detail
  useEffect(() => {
    loadCircleDetail();
  }, [id]);

  // 加载帖子列表 / Load posts
  useEffect(() => {
    if (circle) loadPosts();
  }, [circle, activeTab]);

  const loadCircleDetail = async () => {
    setLoading(true);
    const res = await getCircleDetail(id);
    if (res?.code === 200) setCircle(res.data);
    setLoading(false);
  };

  const loadPosts = async (page = 1) => {
    setPostsLoading(true);
    const ordering = activeTab === 'hot' ? 'hot' : activeTab === 'reply' ? 'reply_at' : 'created_at';
    const res = await getCirclePosts(id, { page, ordering });
    if (res?.code === 200) setPosts(res.data.results);
    setPostsLoading(false);
  };

  // 加入/退出圈子 / Join/Leave circle
  const handleToggleMembership = async () => {
    const action = circle.is_member ? leaveCircle : joinCircle;
    const res = await action(id);
    if (res?.code === 200) {
      message.success(circle.is_member ? '已退出圈子' : '已加入圈子');
      loadCircleDetail();
    }
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

  // 发帖成功回调 / Post created callback
  const handlePostCreated = () => {
    setShowCreateModal(false);
    loadPosts();
  };

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
    headerTop: {
      display: 'flex',
      alignItems: 'center',
      gap: token.paddingSM,
    },
    backBtn: {
      cursor: 'pointer',
      padding: token.paddingXS,
      borderRadius: '50%',
    },
    title: {
      fontSize: token.fontSizeXL,
      fontWeight: 800,
      margin: 0,
    },
    circleInfo: {
      padding: token.padding,
      borderBottom: `1px solid ${token.colorBorder}`,
    },
    circleName: {
      fontSize: 20,
      fontWeight: 700,
      marginBottom: token.paddingXS,
    },
    circleDesc: {
      color: token.colorTextSecondary,
      marginBottom: token.paddingSM,
    },
    circleMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: token.paddingLG,
      marginBottom: token.paddingSM,
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: token.paddingXXS,
      color: token.colorTextSecondary,
    },
    actions: {
      display: 'flex',
      gap: token.paddingSM,
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: token.paddingLG * 2,
    },
    fab: {
      position: 'fixed',
      right: 24,
      bottom: 24,
      width: 56,
      height: 56,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 24,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!circle) {
    return <Empty description="圈子不存在" />;
  }

  const tabItems = [
    { key: 'latest', label: '最新' },
    { key: 'hot', label: '最热' },
    { key: 'reply', label: '最新回复' },
  ];

  return (
    <div style={styles.page}>
      {/* 顶部导航 */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeftOutlined />
          </div>
          <h1 style={styles.title}>话题圈</h1>
        </div>
      </header>

      {/* 圈子信息 */}
      <div style={styles.circleInfo}>
        <div style={styles.circleName}>{circle.name}</div>
        {circle.description && (
          <div style={styles.circleDesc}>{circle.description}</div>
        )}
        <div style={styles.circleMeta}>
          <div style={styles.metaItem}>
            <TeamOutlined />
            <span>{circle.member_count} 成员</span>
          </div>
        </div>
        <div style={styles.actions}>
          <Button
            type={circle.is_member ? 'default' : 'primary'}
            onClick={handleToggleMembership}
          >
            {circle.is_member ? '退出圈子' : '加入圈子'}
          </Button>
        </div>
      </div>

      {/* 帖子列表 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        centered
      />

      {postsLoading ? (
        <div style={styles.loadingContainer}>
          <Spin />
        </div>
      ) : posts.length === 0 ? (
        <Empty description="暂无帖子" style={{ marginTop: 40 }} />
      ) : (
        posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onFavorite={handleFavorite}
          />
        ))
      )}

      {/* 发帖按钮 */}
      {circle.is_member && (
        <Button
          type="primary"
          style={styles.fab}
          icon={<EditOutlined />}
          onClick={() => setShowCreateModal(true)}
        />
      )}

      {/* 发帖弹窗 */}
      <CreatePostModal
        open={showCreateModal}
        circleId={id}
        onCancel={() => setShowCreateModal(false)}
        onSuccess={handlePostCreated}
      />
    </div>
  );
};

export default Circle;
