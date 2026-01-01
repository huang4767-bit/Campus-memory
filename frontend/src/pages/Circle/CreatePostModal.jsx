/**
 * 发帖弹窗组件 / Create Post Modal Component
 */

import { useState } from 'react';
import { Modal, Input, Button, Upload, Tag, message, theme } from 'antd';
import { PictureOutlined, CloseOutlined } from '@ant-design/icons';
import { createPost } from '../../services';

const { TextArea } = Input;

const CreatePostModal = ({ open, circleId, onCancel, onSuccess }) => {
  const { token } = theme.useToken();
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // 重置表单 / Reset form
  const resetForm = () => {
    setContent('');
    setImages([]);
    setTags([]);
    setTagInput('');
  };

  // 提交帖子 / Submit post
  const handleSubmit = async () => {
    if (!content.trim()) {
      message.warning('请输入内容');
      return;
    }

    setLoading(true);
    const res = await createPost(circleId, {
      content: content.trim(),
      images,
      tags,
    });
    if (res?.code === 200 || res?.code === 201) {
      message.success('发布成功');
      resetForm();
      onSuccess?.();
    }
    setLoading(false);
  };

  // 添加标签 / Add tag
  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && tags.length < 5 && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  // 删除标签 / Remove tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // 图片上传配置 / Upload config
  const uploadProps = {
    action: '/api/v1/upload/image/',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    showUploadList: false,
    accept: 'image/jpeg,image/png,image/gif',
    beforeUpload: (file) => {
      if (file.size > 5 * 1024 * 1024) {
        message.error('图片大小不能超过 5MB');
        return false;
      }
      if (images.length >= 9) {
        message.warning('最多上传 9 张图片');
        return false;
      }
      return true;
    },
    onChange: (info) => {
      if (info.file.status === 'done') {
        const url = info.file.response?.data?.url;
        if (url) {
          setImages([...images, url]);
        }
      }
    },
  };

  // 删除图片 / Remove image
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const styles = {
    content: {
      padding: `${token.padding}px 0`,
    },
    imageGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8,
      marginTop: token.paddingSM,
    },
    imageItem: {
      position: 'relative',
      paddingTop: '100%',
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: token.borderRadius,
    },
    removeBtn: {
      position: 'absolute',
      top: 4,
      right: 4,
      background: 'rgba(0,0,0,0.5)',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: 20,
      height: 20,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagSection: {
      marginTop: token.paddingSM,
    },
    tagInput: {
      display: 'flex',
      gap: 8,
      marginBottom: 8,
    },
    tags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      gap: token.paddingSM,
      marginTop: token.paddingSM,
      paddingTop: token.paddingSM,
      borderTop: `1px solid ${token.colorBorder}`,
    },
    charCount: {
      marginLeft: 'auto',
      color: content.length > 5000 ? token.colorError : token.colorTextSecondary,
      fontSize: token.fontSizeSM,
    },
  };

  return (
    <Modal
      title="发布帖子"
      open={open}
      onCancel={() => { resetForm(); onCancel(); }}
      footer={[
        <Button key="cancel" onClick={() => { resetForm(); onCancel(); }}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          disabled={!content.trim() || content.length > 5000}
          onClick={handleSubmit}
        >
          发布
        </Button>,
      ]}
      width={520}
    >
      <div style={styles.content}>
        <TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="分享你的校园记忆..."
          autoSize={{ minRows: 4, maxRows: 10 }}
          maxLength={5000}
          showCount={false}
        />

        {/* 图片预览 */}
        {images.length > 0 && (
          <div style={styles.imageGrid}>
            {images.map((url, index) => (
              <div key={index} style={styles.imageItem}>
                <img src={url} alt="" style={styles.image} />
                <button
                  style={styles.removeBtn}
                  onClick={() => handleRemoveImage(index)}
                >
                  <CloseOutlined style={{ fontSize: 12 }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 标签 */}
        <div style={styles.tagSection}>
          <div style={styles.tagInput}>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="添加标签（最多5个）"
              maxLength={20}
              onPressEnter={handleAddTag}
              style={{ flex: 1 }}
            />
            <Button onClick={handleAddTag} disabled={tags.length >= 5}>
              添加
            </Button>
          </div>
          <div style={styles.tags}>
            {tags.map(tag => (
              <Tag
                key={tag}
                closable
                onClose={() => handleRemoveTag(tag)}
              >
                {tag}
              </Tag>
            ))}
          </div>
        </div>

        {/* 工具栏 */}
        <div style={styles.toolbar}>
          <Upload {...uploadProps}>
            <Button icon={<PictureOutlined />} disabled={images.length >= 9}>
              图片 ({images.length}/9)
            </Button>
          </Upload>
          <span style={styles.charCount}>{content.length}/5000</span>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePostModal;
