/**
 * 个人主页 / Profile Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Button, Tabs, Empty, Spin, theme, Typography } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { getProfile } from '../../services/user';

const { Title, Text, Paragraph } = Typography;

const Profile = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // 加载用户资料 / Load user profile
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await getProfile();
    if (res?.code === 0) setProfile(res.data);
    setLoading(false);
  };

  // Tab 项配置 / Tab items config
  const tabItems = [
    {
      key: 'posts',
      label: '我的帖子',
      children: (
        <Empty
          description="暂无帖子"
          style={{ padding: token.paddingLG * 2 }}
        />
      ),
    },
    {
      key: 'favorites',
      label: '我的收藏',
      children: (
        <Empty
          description="暂无收藏"
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
        {/* 头像和编辑按钮 / Avatar and edit button */}
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
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate('/profile/edit')}
          >
            编辑资料
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

export default Profile;
