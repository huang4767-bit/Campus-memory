/**
 * 编辑资料页 / Profile Edit Page
 * 支持头像裁剪上传 / Supports avatar cropping upload
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Form, Input, DatePicker, Button, Avatar, Upload,
  message, theme, Typography, Spin, Divider,
} from 'antd';
import { UserOutlined, CameraOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import dayjs from 'dayjs';
import SchoolSelect from '../../components/SchoolSelect';
import { getProfile, updateProfile, uploadAvatar } from '../../services/user';
import useUserStore from '../../stores/userStore';

const { Title } = Typography;
const { TextArea } = Input;

const ProfileEdit = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { updateUser } = useUserStore();

  // 加载用户资料 / Load user profile
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await getProfile();
    if (res?.code === 0) {
      const data = res.data;
      setAvatarUrl(data.avatar);
      form.setFieldsValue({
        real_name: data.real_name,
        bio: data.bio,
        school: data.school,
        enrollment_year: data.enrollment_year ? dayjs().year(data.enrollment_year) : null,
        graduation_year: data.graduation_year ? dayjs().year(data.graduation_year) : null,
        class_name: data.class_name,
      });
    }
    setLoading(false);
  };

  // 头像上传前处理 / Before avatar upload
  const handleAvatarUpload = async (file) => {
    setUploadingAvatar(true);
    const res = await uploadAvatar(file);
    if (res?.code === 0) {
      setAvatarUrl(res.data.avatar);
      message.success('头像上传成功');
    }
    setUploadingAvatar(false);
    return false;
  };

  // 提交表单 / Submit form
  const handleSubmit = async (values) => {
    setSaving(true);
    const data = {
      real_name: values.real_name || '',
      bio: values.bio || '',
      school: values.school?.id || null,
      enrollment_year: values.enrollment_year?.year() || null,
      graduation_year: values.graduation_year?.year() || null,
      class_name: values.class_name || '',
    };

    const res = await updateProfile(data);
    if (res?.code === 0) {
      message.success('保存成功');
      updateUser({ profile: res.data });
      navigate('/profile');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: token.paddingLG * 3 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <Card
        style={{
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorder}`,
        }}
        bodyStyle={{ padding: token.paddingLG }}
      >
        {/* 头部 / Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: token.paddingLG }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/profile')}
          />
          <Title level={4} style={{ margin: 0, marginLeft: token.paddingSM }}>
            编辑资料
          </Title>
        </div>

        {/* 头像上传 / Avatar upload */}
        <div style={{ textAlign: 'center', marginBottom: token.paddingLG }}>
          <ImgCrop rotationSlider cropShape="round" modalTitle="裁剪头像">
            <Upload
              showUploadList={false}
              beforeUpload={handleAvatarUpload}
              accept="image/jpeg,image/png,image/gif"
            >
              <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
                <Avatar
                  size={100}
                  src={avatarUrl}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: token.colorPrimary }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: token.colorPrimary,
                  borderRadius: '50%',
                  padding: 6,
                  border: `2px solid ${token.colorBgContainer}`,
                }}>
                  <CameraOutlined style={{ color: '#fff', fontSize: 14 }} />
                </div>
              </div>
            </Upload>
          </ImgCrop>
          {uploadingAvatar && <Spin style={{ marginLeft: token.paddingSM }} />}
        </div>

        <Divider />

        {/* 表单 / Form */}
        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item label="真实姓名" name="real_name">
            <Input placeholder="请输入真实姓名" />
          </Form.Item>

          <Form.Item label="个人简介" name="bio">
            <TextArea rows={3} placeholder="介绍一下自己吧" maxLength={500} showCount />
          </Form.Item>

          <Divider>校友信息</Divider>

          <Form.Item label="学校" name="school">
            <SchoolSelect />
          </Form.Item>

          <Form.Item label="入学年份" name="enrollment_year">
            <DatePicker picker="year" placeholder="请选择入学年份" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="毕业年份" name="graduation_year">
            <DatePicker picker="year" placeholder="请选择毕业年份" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="班级" name="class_name">
            <Input placeholder="如：高三(1)班" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: token.paddingLG }}>
            <Button type="primary" htmlType="submit" loading={saving} block size="large">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfileEdit;
