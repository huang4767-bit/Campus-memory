/**
 * 聊天页面 / Chat Page
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Card, Avatar, Input, Button, List, Spin, Empty, theme, Typography
} from 'antd';
import { UserOutlined, ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import { getMessages, sendMessage, markConversationRead } from '../../services/message';
import { formatRelativeTime } from '../../utils/format';
import { useUserStore } from '../../stores';

const { Text } = Typography;

const Chat = () => {
  const { token } = theme.useToken();
  const { id: conversationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [otherUser, setOtherUser] = useState(location.state?.otherUser || null);

  const messagesEndRef = useRef(null);

  // 滚动到底部 / Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadMessages();
    markAsRead();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    const res = await getMessages(conversationId);
    if (res?.code === 200) {
      // 消息按时间倒序返回，需要反转 / Messages returned in desc order, need to reverse
      setMessages((res.data?.results || []).reverse());
    }
    setLoading(false);
  };

  const markAsRead = async () => {
    await markConversationRead(conversationId);
  };

  // 发送消息（乐观更新）/ Send message (optimistic update)
  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;

    const content = inputValue.trim();
    setInputValue('');
    setSending(true);

    // 乐观更新：立即显示消息 / Optimistic update: show message immediately
    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender: { id: user?.id, username: user?.username },
      content,
      created_at: new Date().toISOString(),
      is_sending: true,
    };
    setMessages(prev => [...prev, tempMessage]);

    const res = await sendMessage({
      receiver_id: otherUser?.id,
      content,
    });

    if (res?.code === 200) {
      // 替换临时消息 / Replace temp message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessage.id ? { ...res.data, is_sending: false } : msg
        )
      );
    } else {
      // 发送失败，标记错误 / Send failed, mark error
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessage.id ? { ...msg, is_sending: false, is_error: true } : msg
        )
      );
    }
    setSending(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', height: 'calc(100vh - 120px)' }}>
      <Card
        style={{
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorder}`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        bodyStyle={{
          padding: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* 头部 / Header */}
        <div style={{
          padding: token.padding,
          borderBottom: `1px solid ${token.colorBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: token.padding,
        }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/message')}
          />
          <Avatar
            src={otherUser?.avatar}
            icon={<UserOutlined />}
            style={{ backgroundColor: token.colorPrimary }}
          />
          <Text strong>{otherUser?.username || '用户'}</Text>
        </div>

        {/* 消息列表 / Message list */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: token.padding,
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: token.paddingLG }}>
              <Spin />
            </div>
          ) : messages.length === 0 ? (
            <Empty description="暂无消息，发送第一条消息吧" />
          ) : (
            <List
              dataSource={messages}
              renderItem={(msg) => {
                const isMine = msg.sender?.id === user?.id;
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: isMine ? 'flex-end' : 'flex-start',
                      marginBottom: token.padding,
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: isMine ? 'row-reverse' : 'row',
                      gap: 8,
                    }}>
                      {!isMine && (
                        <Avatar
                          size="small"
                          src={msg.sender?.avatar}
                          icon={<UserOutlined />}
                        />
                      )}
                      <div>
                        <div style={{
                          padding: `${token.paddingXS}px ${token.padding}px`,
                          borderRadius: token.borderRadiusLG,
                          backgroundColor: isMine ? token.colorPrimary : token.colorBgContainer,
                          color: isMine ? '#fff' : token.colorText,
                          border: isMine ? 'none' : `1px solid ${token.colorBorder}`,
                          opacity: msg.is_sending ? 0.6 : 1,
                        }}>
                          {msg.content}
                        </div>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: 11,
                            display: 'block',
                            textAlign: isMine ? 'right' : 'left',
                            marginTop: 2,
                          }}
                        >
                          {msg.is_error ? '发送失败' : formatRelativeTime(msg.created_at)}
                        </Text>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入框 / Input area */}
        <div style={{
          padding: token.padding,
          borderTop: `1px solid ${token.colorBorder}`,
          display: 'flex',
          gap: token.paddingSM,
        }}>
          <Input.TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            loading={sending}
            disabled={!inputValue.trim()}
          />
        </div>
      </Card>
    </div>
  );
};

export default Chat;
