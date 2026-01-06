/**
 * 好友页面 / Friend Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Tabs, List, Avatar, Button, Empty, Spin, Badge,
  theme, Typography, Popconfirm, message
} from 'antd';
import {
  UserOutlined, TeamOutlined, StopOutlined,
  CheckOutlined, CloseOutlined, DeleteOutlined, MessageOutlined
} from '@ant-design/icons';
import {
  getFriends, getPendingRequests, getBlacklist,
  acceptFriendRequest, rejectFriendRequest,
  deleteFriend, removeFromBlacklist
} from '../../services/friend';
import { sendMessage } from '../../services/message';
import { formatRelativeTime } from '../../utils/format';

const { Text } = Typography;

const Friend = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('friends');
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [blacklist, setBlacklist] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [friendsRes, requestsRes, blacklistRes] = await Promise.all([
      getFriends(),
      getPendingRequests(),
      getBlacklist()
    ]);

    if (friendsRes?.code === 200) setFriends(friendsRes.data?.results || []);
    if (requestsRes?.code === 200) setRequests(requestsRes.data || []);
    if (blacklistRes?.code === 200) setBlacklist(blacklistRes.data || []);
    setLoading(false);
  };

  // 接受好友请求 / Accept friend request
  const handleAccept = async (requestId) => {
    const res = await acceptFriendRequest(requestId);
    if (res?.code === 200) {
      message.success('已添加好友');
      loadData();
    }
  };

  // 拒绝好友请求 / Reject friend request
  const handleReject = async (requestId) => {
    const res = await rejectFriendRequest(requestId);
    if (res?.code === 200) {
      message.success('已拒绝');
      setRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  // 删除好友 / Delete friend
  const handleDeleteFriend = async (friendId) => {
    const res = await deleteFriend(friendId);
    if (res?.code === 200) {
      message.success('已删除好友');
      setFriends(prev => prev.filter(f => f.friend?.id !== friendId));
    }
  };

  // 移出黑名单 / Remove from blacklist
  const handleRemoveBlacklist = async (userId) => {
    const res = await removeFromBlacklist(userId);
    if (res?.code === 200) {
      message.success('已移出黑名单');
      setBlacklist(prev => prev.filter(b => b.blocked_user?.id !== userId));
    }
  };

  // 发私信 / Send message
  const handleSendMessage = (userId) => {
    navigate(`/message`, { state: { startChatWith: userId } });
  };

  // 查看用户主页 / View user profile
  const handleViewUser = (userId) => {
    navigate(`/user/${userId}`);
  };

  // 好友列表渲染 / Friend list render
  const renderFriendList = () => (
    friends.length === 0 ? (
      <Empty description="暂无好友" style={{ padding: token.paddingLG * 2 }} />
    ) : (
      <List
        dataSource={friends}
        renderItem={(item) => (
          <List.Item
            style={{ padding: `${token.padding}px ${token.paddingLG}px` }}
            actions={[
              <Button
                key="msg"
                type="text"
                icon={<MessageOutlined />}
                onClick={() => handleSendMessage(item.friend?.id)}
              />,
              <Popconfirm
                key="del"
                title="确定删除该好友吗？"
                onConfirm={() => handleDeleteFriend(item.friend?.id)}
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={item.friend?.avatar}
                  icon={<UserOutlined />}
                  style={{ cursor: 'pointer', backgroundColor: token.colorPrimary }}
                  onClick={() => handleViewUser(item.friend?.id)}
                />
              }
              title={
                <Text
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleViewUser(item.friend?.id)}
                >
                  {item.friend?.username}
                </Text>
              }
              description={
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {formatRelativeTime(item.created_at)} 成为好友
                </Text>
              }
            />
          </List.Item>
        )}
      />
    )
  );

  // 好友申请列表渲染 / Request list render
  const renderRequestList = () => (
    requests.length === 0 ? (
      <Empty description="暂无好友申请" style={{ padding: token.paddingLG * 2 }} />
    ) : (
      <List
        dataSource={requests}
        renderItem={(item) => (
          <List.Item
            style={{ padding: `${token.padding}px ${token.paddingLG}px` }}
            actions={[
              <Button
                key="accept"
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleAccept(item.id)}
              >
                接受
              </Button>,
              <Button
                key="reject"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleReject(item.id)}
              >
                拒绝
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={item.from_user?.avatar}
                  icon={<UserOutlined />}
                  style={{ cursor: 'pointer', backgroundColor: token.colorPrimary }}
                  onClick={() => handleViewUser(item.from_user?.id)}
                />
              }
              title={item.from_user?.username}
              description={item.message || '请求添加你为好友'}
            />
          </List.Item>
        )}
      />
    )
  );

  // 黑名单列表渲染 / Blacklist render
  const renderBlacklist = () => (
    blacklist.length === 0 ? (
      <Empty description="黑名单为空" style={{ padding: token.paddingLG * 2 }} />
    ) : (
      <List
        dataSource={blacklist}
        renderItem={(item) => (
          <List.Item
            style={{ padding: `${token.padding}px ${token.paddingLG}px` }}
            actions={[
              <Popconfirm
                key="remove"
                title="确定移出黑名单吗？"
                onConfirm={() => handleRemoveBlacklist(item.blocked_user?.id)}
              >
                <Button size="small">移出黑名单</Button>
              </Popconfirm>
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={item.blocked_user?.avatar}
                  icon={<UserOutlined />}
                />
              }
              title={item.blocked_user?.username}
            />
          </List.Item>
        )}
      />
    )
  );

  const tabItems = [
    {
      key: 'friends',
      label: (
        <span><TeamOutlined style={{ marginRight: 4 }} />好友 ({friends.length})</span>
      ),
      children: renderFriendList(),
    },
    {
      key: 'requests',
      label: (
        <Badge count={requests.length} size="small" offset={[6, 0]}>
          <span><UserOutlined style={{ marginRight: 4 }} />好友申请</span>
        </Badge>
      ),
      children: renderRequestList(),
    },
    {
      key: 'blacklist',
      label: (
        <span><StopOutlined style={{ marginRight: 4 }} />黑名单</span>
      ),
      children: renderBlacklist(),
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
      <Card
        style={{
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorder}`,
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          style={{ padding: `0 ${token.padding}px` }}
        />
      </Card>
    </div>
  );
};

export default Friend;
