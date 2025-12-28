/**
 * 左侧导航栏 / Left Sidebar
 */

import { useNavigate, useLocation } from 'react-router-dom';
import { Button, theme } from 'antd';
import {
  HomeOutlined,
  HomeFilled,
  SearchOutlined,
  BellOutlined,
  BellFilled,
  MailOutlined,
  MailFilled,
  UserOutlined,
} from '@ant-design/icons';
import { useUserStore } from '../../stores';
import UserAvatar from '../UserAvatar';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const { user, isLoggedIn } = useUserStore();

  const menuItems = [
    { key: '/', icon: HomeOutlined, activeIcon: HomeFilled, label: '首页' },
    { key: '/explore', icon: SearchOutlined, activeIcon: SearchOutlined, label: '探索' },
    { key: '/notifications', icon: BellOutlined, activeIcon: BellFilled, label: '通知' },
    { key: '/messages', icon: MailOutlined, activeIcon: MailFilled, label: '消息' },
    { key: '/profile', icon: UserOutlined, activeIcon: UserOutlined, label: '个人主页' },
  ];

  const isActive = (path) => location.pathname === path;

  const styles = {
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: `${token.paddingXS}px 0`,
    },
    logo: {
      padding: token.paddingSM,
      cursor: 'pointer',
    },
    logoText: {
      fontSize: token.fontSizeXL,
      fontWeight: 800,
      color: token.colorPrimary,
    },
    nav: {
      flex: 1,
      marginTop: token.paddingXS,
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: `${token.paddingSM}px ${token.padding}px`,
      borderRadius: 9999,
      cursor: 'pointer',
      transition: 'background-color 0.15s',
    },
    navIcon: {
      fontSize: 26,
      marginRight: token.paddingLG,
    },
    navLabel: {
      fontSize: token.fontSizeXL,
    },
    postBtn: {
      margin: `${token.padding}px ${token.paddingSM}px`,
      height: 52,
      fontSize: token.fontSizeLG,
      fontWeight: 700,
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      padding: token.paddingSM,
      borderRadius: 9999,
      cursor: 'pointer',
      marginTop: 'auto',
    },
    userInfo: {
      marginLeft: token.paddingSM,
    },
    userName: {
      fontWeight: 700,
      fontSize: token.fontSize,
    },
    userHandle: {
      color: token.colorTextSecondary,
      fontSize: token.fontSizeSM,
    },
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        <span style={styles.logoText}>Campus Memory</span>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const active = isActive(item.key);
          const Icon = active ? item.activeIcon : item.icon;
          return (
            <div
              key={item.key}
              style={{
                ...styles.navItem,
                fontWeight: active ? 700 : 400,
              }}
              onClick={() => navigate(item.key)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 20, 25, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Icon style={styles.navIcon} />
              <span style={styles.navLabel}>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <Button type="primary" size="large" style={styles.postBtn} block>
        发帖
      </Button>

      {isLoggedIn && user && (
        <div
          style={styles.userSection}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 20, 25, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <UserAvatar src={user.avatar} size={40} />
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user.real_name || user.username}</div>
            <div style={styles.userHandle}>@{user.username}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
