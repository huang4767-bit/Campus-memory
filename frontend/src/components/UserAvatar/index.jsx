/**
 * 用户头像组件 / User Avatar Component
 */

import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const UserAvatar = ({ src, size = 48, className = '' }) => {
  return (
    <Avatar
      src={src}
      size={size}
      icon={<UserOutlined />}
      className={className}
      style={{ flexShrink: 0 }}
    />
  );
};

export default UserAvatar;
