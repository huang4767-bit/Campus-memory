/**
 * 他人主页 / User Profile Page
 * 查看其他用户的公开信息 / View other user's public info
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Avatar, Button, Tabs, Empty, Spin, Space, theme, Typography, Result, message } from 'antd';
import {
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ArrowLeftOutlined,
  UserAddOutlined,
  MessageOutlined,
  CheckOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { getUserById } from '../../services/user';
import { sendFriendRequest } from '../../services/friend';
import { useUserStore } from '../../stores';

const { Title, Text, Paragraph } = Typography;

const UserProfile = () => {
  const { token } = theme.useToken();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [friendStatus, setFriendStatus] = useState('none'); // none, pending, friend
  const [actionLoading, setActionLoading] = useState(false);

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
    if (res?.code === 200) {
      setProfile(res.data);
      // 设置好友状态 / Set friend status
      setFriendStatus(res.data?.friend_status || 'none');
    } else if (res) {
      setError(res.message || '用户不存在');
    }
    setLoading(false);
  };

  // 发送好友请求 / Send friend request
  const handleAddFriend = async () => {
    setActionLoading(true);
    const res = await sendFriendRequest({ to_user_id: parseInt(id) });
    if (res?.code === 200 || res?.code === 201) {
      message.success('好友请求已发送');
      setFriendStatus('pending');
    }
    setActionLoading(false);
  };

  // 发私信 / Send message
  const handleSendMessage = () => {
    navigate(`/message`, { state: { startChatWith: parseInt(id) } });
  };

  // 渲染操作按钮 / Render action buttons
  const renderActionButtons = () => {
    // 不显示自己的操作按钮 / Don't show buttons for self
    if (user?.id === parseInt(id)) return null;

    return (
      <Space>
        {friendStatus === 'friend' ? (
          <Button icon={<CheckOutlined />} disabled>已是好友</Button>
        ) : friendStatus === 'pending' ? (
          <Button icon={<UserAddOutlined />} disabled>已申请</Button>
        ) : (
          <Button
            icon={<UserAddOutlined />}
            onClick={handleAddFriend}
            loading={actionLoading}
          >
            加好友
          </Button>
        )}
        <Button icon={<MessageOutlined />} onClick={handleSendMessage}>
          私信
        </Button>
      </Space>
    );
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
          {renderActionButtons()}
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
