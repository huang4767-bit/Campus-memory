/**
 * 班级相册页面 / Class Album Page
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  theme, Button, Spin, Empty, Image, Upload, Modal, Form, Input, DatePicker,
  message, Card, Popconfirm
} from 'antd';
import {
  ArrowLeftOutlined, PlusOutlined, DeleteOutlined, PictureOutlined
} from '@ant-design/icons';
import { getCircleDetail } from '../../services';
import { getCircleAlbum, uploadPhoto, deletePhoto } from '../../services/album';
import { formatRelativeTime } from '../../utils/format';

const Album = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const [circle, setCircle] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [form] = Form.useForm();

  // 加载圈子详情和相册 / Load circle detail and album
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    const [circleRes, albumRes] = await Promise.all([
      getCircleDetail(id),
      getCircleAlbum(id)
    ]);
    if (circleRes?.code === 200) setCircle(circleRes.data);
    if (albumRes?.code === 200) setPhotos(albumRes.data?.results || []);
    setLoading(false);
  };

  // 上传照片 / Upload photo
  const handleUpload = async (values) => {
    if (!values.image?.file) {
      message.error('请选择图片');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', values.image.file);
    if (values.description) formData.append('description', values.description);
    if (values.taken_at) {
      formData.append('taken_at', values.taken_at.format('YYYY-MM-DD'));
    }

    const res = await uploadPhoto(id, formData);
    if (res?.code === 201) {
      message.success('上传成功');
      setShowUploadModal(false);
      form.resetFields();
      loadData();
    }
    setUploading(false);
  };

  // 删除照片 / Delete photo
  const handleDelete = async (photoId) => {
    const res = await deletePhoto(photoId);
    if (res?.code === 200) {
      message.success('删除成功');
      setPhotos(photos.filter(p => p.id !== photoId));
    }
  };

  // 预览图片 / Preview image
  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
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
      justifyContent: 'space-between',
    },
    headerLeft: {
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
    content: { padding: token.padding },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: token.paddingSM,
    },
    photoCard: {
      position: 'relative',
      aspectRatio: '1',
      borderRadius: token.borderRadius,
      overflow: 'hidden',
      cursor: 'pointer',
    },
    photoImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    photoOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: token.paddingXS,
      background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
      color: '#fff',
      fontSize: 12,
    },
    deleteBtn: {
      position: 'absolute',
      top: 4,
      right: 4,
      background: 'rgba(0,0,0,0.5)',
      border: 'none',
      color: '#fff',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      padding: token.paddingLG * 2,
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

  if (circle.circle_type !== 'class') {
    return <Empty description="仅班级圈支持相册功能" />;
  }

  return (
    <div style={styles.page}>
      {/* 顶部导航 */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeftOutlined />
          </div>
          <h1 style={styles.title}>
            <PictureOutlined style={{ marginRight: 8 }} />
            班级相册
          </h1>
        </div>
        {circle.is_member && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowUploadModal(true)}
          >
            上传
          </Button>
        )}
      </header>

      {/* 相册内容 */}
      <div style={styles.content}>
        {photos.length === 0 ? (
          <Empty description="暂无照片" style={{ marginTop: 40 }} />
        ) : (
          <div style={styles.grid}>
            {photos.map(photo => (
              <div key={photo.id} style={styles.photoCard}>
                <img
                  src={photo.image_url}
                  alt={photo.description || '照片'}
                  style={styles.photoImage}
                  onClick={() => handlePreview(photo.image_url)}
                />
                {photo.description && (
                  <div style={styles.photoOverlay}>
                    {photo.description}
                  </div>
                )}
                <Popconfirm
                  title="确定删除这张照片吗？"
                  onConfirm={() => handleDelete(photo.id)}
                  okText="删除"
                  cancelText="取消"
                >
                  <Button
                    size="small"
                    icon={<DeleteOutlined />}
                    style={styles.deleteBtn}
                  />
                </Popconfirm>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 上传弹窗 */}
      <Modal
        title="上传照片"
        open={showUploadModal}
        onCancel={() => setShowUploadModal(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleUpload}>
          <Form.Item
            name="image"
            label="选择图片"
            rules={[{ required: true, message: '请选择图片' }]}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>选择图片</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="description" label="照片备注">
            <Input.TextArea
              placeholder="添加照片备注（可选）"
              maxLength={500}
              rows={3}
            />
          </Form.Item>

          <Form.Item name="taken_at" label="拍摄时间">
            <DatePicker placeholder="选择拍摄时间（可选）" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploading} block>
              上传
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 图片预览 */}
      <Image
        style={{ display: 'none' }}
        preview={{
          visible: previewVisible,
          src: previewImage,
          onVisibleChange: (visible) => setPreviewVisible(visible),
        }}
      />
    </div>
  );
};

export default Album;
