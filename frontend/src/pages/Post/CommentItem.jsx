/**
 * 评论项组件 / Comment Item Component
 */

import { theme } from 'antd';
import { HeartOutlined, HeartFilled, DeleteOutlined } from '@ant-design/icons';
import UserAvatar from '../../components/UserAvatar';
import { formatRelativeTime } from '../../utils/format';

const CommentItem = ({ comment, onReply, onDelete, onLike }) => {
  const { token } = theme.useToken();

  const styles = {
    container: {
      padding: token.padding,
      borderBottom: `1px solid ${token.colorBorder}`,
    },
    main: {
      display: 'flex',
      gap: token.paddingSM,
    },
    content: { flex: 1 },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: token.paddingXS,
      marginBottom: token.paddingXXS,
    },
    author: { fontWeight: 700, fontSize: token.fontSize },
    time: { color: token.colorTextSecondary, fontSize: token.fontSizeSM },
    text: { lineHeight: 1.5, marginBottom: token.paddingXS },
    actions: {
      display: 'flex',
      gap: token.paddingLG,
      color: token.colorTextSecondary,
      fontSize: token.fontSizeSM,
    },
    action: { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 },
    replies: {
      marginLeft: 48,
      marginTop: token.paddingSM,
      borderLeft: `2px solid ${token.colorBorder}`,
      paddingLeft: token.paddingSM,
    },
    reply: { marginBottom: token.paddingSM },
    replyHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: token.paddingXS,
      marginBottom: token.paddingXXS,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.main}>
        <UserAvatar src={comment.author?.avatar} size={40} />
        <div style={styles.content}>
          <div style={styles.header}>
            <span style={styles.author}>{comment.author?.username}</span>
            <span style={styles.time}>{formatRelativeTime(comment.created_at)}</span>
          </div>
          <div style={styles.text}>{comment.content}</div>
          <div style={styles.actions}>
            <span style={styles.action} onClick={() => onReply(comment)}>
              回复
            </span>
            <span
              style={{ ...styles.action, color: comment.is_liked ? token.colorLike : undefined }}
              onClick={() => onLike(comment.id)}
            >
              {comment.is_liked ? <HeartFilled /> : <HeartOutlined />}
              {comment.like_count > 0 && comment.like_count}
            </span>
            <span style={styles.action} onClick={() => onDelete(comment.id)}>
              <DeleteOutlined />
            </span>
          </div>
        </div>
      </div>

      {/* 楼中楼回复 */}
      {comment.replies?.length > 0 && (
        <div style={styles.replies}>
          {comment.replies.map(reply => (
            <div key={reply.id} style={styles.reply}>
              <div style={styles.replyHeader}>
                <UserAvatar src={reply.author?.avatar} size={24} />
                <span style={styles.author}>{reply.author?.username}</span>
                {reply.reply_to_username && (
                  <span style={{ color: token.colorTextSecondary }}>
                    回复 @{reply.reply_to_username}
                  </span>
                )}
                <span style={styles.time}>{formatRelativeTime(reply.created_at)}</span>
              </div>
              <div style={{ ...styles.text, marginLeft: 32 }}>{reply.content}</div>
              <div style={{ ...styles.actions, marginLeft: 32 }}>
                <span style={styles.action} onClick={() => onReply(reply, comment.id)}>
                  回复
                </span>
                <span
                  style={{ ...styles.action, color: reply.is_liked ? token.colorLike : undefined }}
                  onClick={() => onLike(reply.id)}
                >
                  {reply.is_liked ? <HeartFilled /> : <HeartOutlined />}
                  {reply.like_count > 0 && reply.like_count}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
