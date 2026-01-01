/**
 * 帖子详情页 / Post Detail Page
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { theme, Spin, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import UserAvatar from '../../components/UserAvatar';
import PostActions from './PostActions';
import CommentSection from './CommentSection';
import { formatFullTime } from '../../utils/format';
import {
  getPostDetail,
  togglePostLike,
  togglePostFavorite,
} from '../../services';

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    const res = await getPostDetail(id);
    if (res?.code === 200) setPost(res.data);
    setLoading(false);
  };

  // 点赞 / Like
  const handleLike = async () => {
    const res = await togglePostLike(id);
    if (res?.code === 200) {
      setPost({
        ...post,
        is_liked: res.data.liked,
        like_count: post.like_count + (res.data.liked ? 1 : -1),
      });
    }
  };

  // 收藏 / Favorite
  const handleFavorite = async () => {
    const res = await togglePostFavorite(id);
    if (res?.code === 200) {
      setPost({ ...post, is_favorited: res.data.favorited });
    }
  };

  const styles = {
    page: { minHeight: '100vh' },
    header: {
      position: 'sticky',
      top: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      padding: token.padding,
      borderBottom: `1px solid ${token.colorBorder}`,
      zIndex: 10,
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
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: token.paddingLG * 2,
    },
    postContent: {
      padding: token.padding,
      borderBottom: `1px solid ${token.colorBorder}`,
    },
    authorRow: {
      display: 'flex',
      alignItems: 'center',
      gap: token.paddingSM,
      marginBottom: token.paddingSM,
    },
    authorInfo: { flex: 1 },
    authorName: { fontWeight: 700, fontSize: token.fontSize },
    authorHandle: { color: token.colorTextSecondary, fontSize: token.fontSizeSM },
    content: {
      fontSize: 17,
      lineHeight: 1.5,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      marginBottom: token.paddingSM,
    },
    time: {
      color: token.colorTextSecondary,
      fontSize: token.fontSizeSM,
      paddingTop: token.paddingSM,
      borderTop: `1px solid ${token.colorBorder}`,
    },
  };

  if (loading) {
    return <div style={styles.loadingContainer}><Spin size="large" /></div>;
  }

  if (!post) {
    return <Empty description="帖子不存在" />;
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeftOutlined />
        </div>
        <h1 style={styles.title}>帖子</h1>
      </header>

      <div style={styles.postContent}>
        <div style={styles.authorRow}>
          <UserAvatar src={post.author?.avatar} size={48} />
          <div style={styles.authorInfo}>
            <div style={styles.authorName}>{post.author?.username}</div>
            <div style={styles.authorHandle}>@{post.author?.username}</div>
          </div>
        </div>

        <div style={styles.content}>{post.content}</div>

        {post.images?.length > 0 && (
          <ImageGrid images={post.images} token={token} />
        )}

        {post.tags?.length > 0 && (
          <TagList tags={post.tags} token={token} />
        )}

        <div style={styles.time}>{formatFullTime(post.created_at)}</div>
      </div>

      <PostActions
        post={post}
        onLike={handleLike}
        onFavorite={handleFavorite}
      />

      <CommentSection postId={id} />
    </div>
  );
};

// 图片网格 / Image Grid
const ImageGrid = ({ images, token }) => {
  const style = {
    display: 'grid',
    gap: 2,
    marginBottom: token.paddingSM,
    borderRadius: token.borderRadiusLG,
    overflow: 'hidden',
    gridTemplateColumns: images.length === 1 ? '1fr' : '1fr 1fr',
  };

  return (
    <div style={style}>
      {images.slice(0, 4).map((img, i) => (
        <img key={i} src={img} alt="" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
      ))}
    </div>
  );
};

// 标签列表 / Tag List
const TagList = ({ tags, token }) => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: token.paddingSM }}>
    {tags.map(tag => (
      <span key={tag} style={{
        backgroundColor: 'rgba(29, 155, 240, 0.1)',
        color: token.colorPrimary,
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: token.fontSizeSM,
      }}>
        #{tag}
      </span>
    ))}
  </div>
);

export default Post;
