/**
 * 他人主页 / User Profile Page
 * 查看其他用户的公开信息 / View other user's public info
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Avatar, Button, Tabs, Empty, Spin, theme, Typography, Result } from 'antd';
import {
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { getUserById } from '../../services/user';

const { Title, Text, Paragraph } = Typography;

const UserProfile = () => {
  const { token } = theme.useToken();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  // 加载用户资料 / Load user profile
  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    const res = await getUserById(id);
    if (res?.code === 0) {
      setProfile(res.data);
    } else if (res) {
      setError(res.message || '用户不存在');
    }
    setLoading(false);
  };

  // Tab 项配置 / Tab items config
  const tabItems = [
    {
      key: 'posts',
      label: 'TA的帖子',
      children: (
        <Empty
          description="暂无帖子"
          style={{ padding: token.paddingLG * 2 }}
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: token.paddingLG * 3 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="404"
        title="用户不存在"
        subTitle={error}
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            返回
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* 头部卡片 / Header card */}
      <Card
        style={{
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorder}`,
          marginBottom: token.padding,
        }}
        bodyStyle={{ padding: token.paddingLG }}
      >
        {/* 返回按钮 / Back button */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: token.padding }}
        >
          返回
        </Button>

        {/* 头像和操作按钮 / Avatar and action buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: token.padding,
        }}>
          <Avatar
            size={80}
            src={profile?.avatar}
            icon={<UserOutlined />}
            style={{ backgroundColor: token.colorPrimary }}
          />
          <Button icon={<UserAddOutlined />}>
            加好友
          </Button>
        </div>

        {/* 用户名和简介 / Username and bio */}
        <Title level={4} style={{ marginBottom: token.paddingXS }}>
          {profile?.user?.username || '用户'}
        </Title>
        {profile?.real_name && (
          <Text type="secondary" style={{ display: 'block', marginBottom: token.paddingSM }}>
            {profile.real_name}
          </Text>
        )}
        {profile?.bio && (
          <Paragraph style={{ marginBottom: token.padding }}>
            {profile.bio}
          </Paragraph>
        )}

        {/* 校友信息 / Alumni info */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: token.padding }}>
          {profile?.school && (
            <Text type="secondary">
              <EnvironmentOutlined style={{ marginRight: 4 }} />
              {profile.school.name}
            </Text>
          )}
          {profile?.enrollment_year && profile?.graduation_year && (
            <Text type="secondary">
              <CalendarOutlined style={{ marginRight: 4 }} />
              {profile.enrollment_year} - {profile.graduation_year}
            </Text>
          )}
          {profile?.class_name && (
            <Text type="secondary">
              {profile.class_name}
            </Text>
          )}
        </div>
      </Card>

      {/* 内容 Tabs / Content tabs */}
      <Card
        style={{
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorder}`,
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Tabs
          items={tabItems}
          defaultActiveKey="posts"
          style={{ padding: `0 ${token.padding}px` }}
        />
      </Card>
    </div>
  );
};

export default UserProfile;
