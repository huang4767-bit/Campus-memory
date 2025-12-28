/**
 * 注册页 / Register Page
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, message, theme } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { token } = theme.useToken();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Register:', values);
      message.success('注册成功');
      navigate('/');
    } catch (error) {
      message.error('注册失败');
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
        <p style={styles.subtitle}>创建你的账号</p>

        <Form onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 4, max: 20, message: '用户名需4-20位' },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 20, message: '密码需6-20位' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              注册
            </Button>
          </Form.Item>
        </Form>

        <p style={styles.footer}>
          已有账号？<Link to="/login">立即登录</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
