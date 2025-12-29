/**
 * 登录页 / Login Page
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, theme } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../../services/auth';
import useUserStore from '../../stores/userStore';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();
  const setUser = useUserStore((state) => state.setUser);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await login(values);
      // 存储 Token / Store tokens
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      // 存储用户信息 / Store user info
      setUser(res.data.user);
      message.success('登录成功');
      navigate('/');
    } catch (error) {
      const msg = error.response?.data?.message || '登录失败';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: token.colorBgContainer,
    },
    container: {
      width: '100%',
      maxWidth: 400,
      padding: 32,
    },
    title: {
      fontSize: 32,
      fontWeight: 800,
      color: token.colorPrimary,
      textAlign: 'center',
      marginBottom: token.paddingXS,
    },
    subtitle: {
      fontSize: token.fontSize,
      color: token.colorTextSecondary,
      textAlign: 'center',
      marginBottom: 32,
    },
    footer: {
      textAlign: 'center',
      color: token.colorTextSecondary,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Campus Memory</h1>
        <p style={styles.subtitle}>登录你的账号</p>

        <Form onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>

        <p style={styles.footer}>
          还没有账号？<Link to="/register">立即注册</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
