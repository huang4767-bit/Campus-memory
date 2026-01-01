/**
 * 评论区组件 / Comment Section Component
 */

import { useState, useEffect } from 'react';
import { theme, Input, Button, Spin, Empty, message } from 'antd';
import CommentItem from './CommentItem';
import {
  getPostComments,
  createComment,
  deleteComment,
  toggleCommentLike,
} from '../../services';

const { TextArea } = Input;

const CommentSection = ({ postId }) => {
  const { token } = theme.useToken();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    setLoading(true);
    const res = await getPostComments(postId);
    if (res?.code === 200) setComments(res.data.results);
    setLoading(false);
  };

  // 发表评论 / Submit comment
  const handleSubmit = async () => {
    if (!content.trim()) return;

    setSubmitting(true);
    const data = { content: content.trim() };
    if (replyTo) {
      data.parent_id = replyTo.parentId || replyTo.id;
      data.reply_to_id = replyTo.userId;
    }

    const res = await createComment(postId, data);
    if (res?.code === 200 || res?.code === 201) {
      message.success('评论成功');
      setContent('');
      setReplyTo(null);
      loadComments();
    }
    setSubmitting(false);
  };

  // 删除评论 / Delete comment
  const handleDelete = async (commentId) => {
    const res = await deleteComment(commentId);
    if (res?.code === 200) {
      message.success('删除成功');
      loadComments();
    }
  };

  // 点赞评论 / Like comment
  const handleLike = async (commentId) => {
    const res = await toggleCommentLike(commentId);
    if (res?.code === 200) loadComments();
  };

  // 回复评论 / Reply to comment
  const handleReply = (comment, parentId = null) => {
    setReplyTo({
      id: comment.id,
      parentId: parentId || comment.id,
      userId: comment.author.id,
      username: comment.author.username,
    });
  };

  const styles = {
    container: { padding: token.padding },
    title: {
      fontSize: token.fontSizeLG,
      fontWeight: 700,
      marginBottom: token.padding,
    },
    inputBox: {
      marginBottom: token.padding,
      borderBottom: `1px solid ${token.colorBorder}`,
      paddingBottom: token.padding,
    },
    replyHint: {
      fontSize: token.fontSizeSM,
      color: token.colorTextSecondary,
      marginBottom: token.paddingXS,
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: token.paddingSM,
      marginTop: token.paddingSM,
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      padding: token.paddingLG,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>评论</div>

      <div style={styles.inputBox}>
        {replyTo && (
          <div style={styles.replyHint}>
            回复 @{replyTo.username}
            <span
              style={{ marginLeft: 8, color: token.colorPrimary, cursor: 'pointer' }}
              onClick={() => setReplyTo(null)}
            >
              取消
            </span>
          </div>
        )}
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={replyTo ? `回复 @${replyTo.username}` : '发表评论...'}
          autoSize={{ minRows: 2, maxRows: 4 }}
          maxLength={500}
        />
        <div style={styles.actions}>
          <Button
            type="primary"
            loading={submitting}
            disabled={!content.trim()}
            onClick={handleSubmit}
          >
            发布
          </Button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}><Spin /></div>
      ) : comments.length === 0 ? (
        <Empty description="暂无评论" />
      ) : (
        comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={handleReply}
            onDelete={handleDelete}
            onLike={handleLike}
          />
        ))
      )}
    </div>
  );
};

export default CommentSection;
