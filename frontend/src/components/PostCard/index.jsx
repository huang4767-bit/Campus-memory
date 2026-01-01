/**
 * 帖子卡片组件 / Post Card Component
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from 'antd';
import {
  MessageOutlined,
  HeartOutlined,
  HeartFilled,
  BookOutlined,
  BookFilled,
} from '@ant-design/icons';
import UserAvatar from '../UserAvatar';
import { formatRelativeTime } from '../../utils/format';

// 图片网格组件 / Image Grid Component
const ImageGrid = ({ images, token }) => {
  const gridStyle = {
    display: 'grid',
    gap: 2,
    marginTop: token.paddingSM,
    borderRadius: token.borderRadiusLG,
    overflow: 'hidden',
    gridTemplateColumns: images.length === 1 ? '1fr' : '1fr 1fr',
  };

  const imgStyle = {
    width: '100%',
    height: 200,
    objectFit: 'cover',
  };

  return (
    <div style={gridStyle}>
      {images.slice(0, 4).map((img, index) => (
        <img key={index} src={img} alt="" style={imgStyle} />
      ))}
    </div>
  );
};

// 互动栏组件 / Action Bar Component
const ActionBar = ({ token, commentCount, likeCount, isLiked, isFavorited, onLike, onFavorite }) => {
  const [likeHover, setLikeHover] = useState(false);
  const [bookmarkHover, setBookmarkHover] = useState(false);

  const barStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: 300,
    marginTop: token.paddingSM,
  };

  const itemStyle = (isActive, isLikeType) => ({
    display: 'flex',
    alignItems: 'center',
    gap: token.paddingXXS,
    color: isActive
      ? (isLikeType ? token.colorLike : token.colorPrimary)
      : token.colorTextSecondary,
    cursor: 'pointer',
    padding: token.paddingXXS,
    borderRadius: 9999,
    transition: 'all 0.15s',
  });

  return (
    <div style={barStyle}>
      <div style={itemStyle(false, false)}>
        <MessageOutlined />
        <span>{commentCount || ''}</span>
      </div>
      <div
        style={itemStyle(isLiked || likeHover, true)}
        onClick={(e) => { e.stopPropagation(); onLike(); }}
        onMouseEnter={() => setLikeHover(true)}
        onMouseLeave={() => setLikeHover(false)}
      >
        {isLiked ? <HeartFilled /> : <HeartOutlined />}
        <span>{likeCount || ''}</span>
      </div>
      <div
        style={itemStyle(isFavorited || bookmarkHover, false)}
        onClick={(e) => { e.stopPropagation(); onFavorite(); }}
        onMouseEnter={() => setBookmarkHover(true)}
        onMouseLeave={() => setBookmarkHover(false)}
      >
        {isFavorited ? <BookFilled /> : <BookOutlined />}
      </div>
    </div>
  );
};

const PostCard = ({ post, onLike, onFavorite }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [hovered, setHovered] = useState(false);

  const {
    id,
    author,
    content,
    images = [],
    like_count = 0,
    comment_count = 0,
    is_liked = false,
    is_favorited = false,
    created_at,
    circle,
  } = post;

  const styles = {
    card: {
      display: 'flex',
      padding: token.padding,
      borderBottom: `1px solid ${token.colorBorder}`,
      cursor: 'pointer',
      transition: 'background-color 0.15s',
      backgroundColor: hovered ? token.colorBgSecondary : 'transparent',
    },
    avatar: {
      marginRight: token.paddingSM,
    },
    content: {
      flex: 1,
      minWidth: 0,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: token.paddingXXS,
    },
    author: {
      fontWeight: 700,
      fontSize: token.fontSize,
    },
    handle: {
      color: token.colorTextSecondary,
      fontSize: token.fontSize,
    },
    circleTag: {
      display: 'inline-block',
      backgroundColor: 'rgba(29, 155, 240, 0.1)',
      color: token.colorPrimary,
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: token.fontSizeSM,
      marginTop: token.paddingXXS,
    },
    text: {
      marginTop: token.paddingXXS,
      fontSize: token.fontSize,
      lineHeight: 1.5,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    },
  };

  return (
    <article
      style={styles.card}
      onClick={() => navigate(`/post/${id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.avatar}>
        <UserAvatar src={author?.avatar} size={48} />
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.author}>{author?.real_name || author?.username}</span>
          <span style={styles.handle}>@{author?.username}</span>
          <span style={styles.handle}>·</span>
          <span style={styles.handle}>{formatRelativeTime(created_at)}</span>
        </div>

        {circle && <div style={styles.circleTag}>{circle.name}</div>}

        <div style={styles.text}>{content}</div>

        {images.length > 0 && (
          <ImageGrid images={images} token={token} />
        )}

        <ActionBar
          token={token}
          commentCount={comment_count}
          likeCount={like_count}
          isLiked={is_liked}
          isFavorited={is_favorited}
          onLike={() => onLike?.(id)}
          onFavorite={() => onFavorite?.(id)}
        />
      </div>
    </article>
  );
};

export default PostCard;
