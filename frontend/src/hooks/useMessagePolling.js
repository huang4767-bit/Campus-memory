/**
 * 消息轮询 Hook / Message Polling Hook
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { getMessageUpdates } from '../services/message';

const useMessagePolling = (options = {}) => {
  const {
    interval = 5000,  // 轮询间隔，默认5秒 / Polling interval, default 5s
    enabled = true,   // 是否启用 / Whether enabled
    onNewMessage,     // 新消息回调 / New message callback
  } = options;

  const [unreadCount, setUnreadCount] = useState(0);
  const [newMessages, setNewMessages] = useState([]);
  const lastMessageIdRef = useRef(0);
  const timerRef = useRef(null);

  const poll = useCallback(async () => {
    try {
      const res = await getMessageUpdates(lastMessageIdRef.current);
      if (res?.code === 200) {
        setUnreadCount(res.data?.unread_count || 0);

        const messages = res.data?.new_messages || [];
        if (messages.length > 0) {
          // 更新最后消息ID / Update last message ID
          const maxId = Math.max(...messages.map(m => m.id));
          lastMessageIdRef.current = maxId;

          setNewMessages(messages);
          onNewMessage?.(messages);
        }
      }
    } catch (error) {
      console.error('Message polling error:', error);
    }
  }, [onNewMessage]);

  useEffect(() => {
    if (!enabled) return;

    // 立即执行一次 / Execute immediately
    poll();

    // 设置定时器 / Set timer
    timerRef.current = setInterval(poll, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, interval, poll]);

  // 手动刷新 / Manual refresh
  const refresh = useCallback(() => {
    poll();
  }, [poll]);

  return {
    unreadCount,
    newMessages,
    refresh,
  };
};

export default useMessagePolling;
