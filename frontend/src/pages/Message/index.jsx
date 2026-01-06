/**
 * 消息中心页面 / Message Center Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Avatar, Badge, Empty, Spin, Card, theme, Typography } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import { getConversations } from '../../services/message';
import { formatRelativeTime } from '../../utils/format';

const { Text } = Typography;

const Message = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    const res = await getConversations();
    if (res?.code === 200) {
      setConversations(res.data?.results || []);
    }
    setLoading(false);
  };

  // 点击会话进入聊天 / Click conversation to enter chat
  const handleConversationClick = (conversation) => {
    navigate(`/message/${conversation.id}`, {
      state: { otherUser: conversation.other_user }
    });
  };

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
        title={
          <span>
            <MessageOutlined style={{ marginRight: 8 }} />
            消息
          </span>
        }
        style={{
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorder}`,
        }}
        bodyStyle={{ padding: 0 }}
      >
        {conversations.length === 0 ? (
          <Empty
            description="暂无消息"
            style={{ padding: token.paddingLG * 2 }}
          />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={conversations}
            renderItem={(item) => (
              <List.Item
                onClick={() => handleConversationClick(item)}
                style={{
                  padding: `${token.padding}px ${token.paddingLG}px`,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = token.colorBgTextHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Badge count={item.unread_count} size="small">
                      <Avatar
                        src={item.other_user?.avatar}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: token.colorPrimary }}
                      />
                    </Badge>
                  }
                  title={
                    <Text strong={item.unread_count > 0}>
                      {item.other_user?.username}
                    </Text>
                  }
                  description={
                    <Text
                      type="secondary"
                      ellipsis
                      style={{
                        fontWeight: item.unread_count > 0 ? 500 : 'normal',
                      }}
                    >
                      {item.last_message_content || '暂无消息'}
                    </Text>
                  }
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {item.last_message_time
                    ? formatRelativeTime(item.last_message_time)
                    : ''}
                </Text>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Message;
