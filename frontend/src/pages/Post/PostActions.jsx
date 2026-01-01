/**
 * 帖子互动栏组件 / Post Actions Component
 */

import { theme } from 'antd';
import {
  MessageOutlined,
  HeartOutlined,
  HeartFilled,
  BookOutlined,
  BookFilled,
} from '@ant-design/icons';

const PostActions = ({ post, onLike, onFavorite }) => {
  const { token } = theme.useToken();

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: token.padding,
      borderBottom: `1px solid ${token.colorBorder}`,
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: token.paddingXS,
      cursor: 'pointer',
      padding: `${token.paddingXS}px ${token.paddingSM}px`,
      borderRadius: 9999,
      transition: 'all 0.15s',
    },
  };

  const getItemStyle = (isActive, isLike) => ({
    ...styles.item,
    color: isActive
      ? (isLike ? token.colorLike : token.colorPrimary)
      : token.colorTextSecondary,
  });

  return (
    <div style={styles.container}>
      <div style={getItemStyle(false, false)}>
        <MessageOutlined />
        <span>{post.comment_count || 0}</span>
      </div>
      <div style={getItemStyle(post.is_liked, true)} onClick={onLike}>
        {post.is_liked ? <HeartFilled /> : <HeartOutlined />}
        <span>{post.like_count || 0}</span>
      </div>
      <div style={getItemStyle(post.is_favorited, false)} onClick={onFavorite}>
        {post.is_favorited ? <BookFilled /> : <BookOutlined />}
      </div>
    </div>
  );
};

export default PostActions;
