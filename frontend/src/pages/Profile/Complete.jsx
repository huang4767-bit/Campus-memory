/**
 * 完善信息页 / Profile Complete Page
 * 新用户注册后必须填写校友信息 / New users must fill in alumni info after registration
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, DatePicker, Button, message, theme, Typography } from 'antd';
import SchoolSelect from '../../components/SchoolSelect';
import { updateProfile } from '../../services/user';
import useUserStore from '../../stores/userStore';

const { Title, Text } = Typography;

const ProfileComplete = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { updateUser } = useUserStore();

  // 提交表单 / Submit form
  const handleSubmit = async (values) => {
    if (!values.school) {
      message.error('请选择学校');
      return;
    }

    setLoading(true);
    const data = {
      real_name: values.real_name,
      school: values.school.id,
      enrollment_year: values.enrollment_year?.year(),
      graduation_year: values.graduation_year?.year(),
      class_name: values.class_name,
      is_profile_complete: true,
    };

    const res = await updateProfile(data);
    if (res?.code === 0) {
      message.success('资料完善成功');
      updateUser({ profile: res.data });
      navigate('/');
    }
    setLoading(false);
  };

  // 页面容器样式 / Page container style
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: token.paddingLG,
    background: token.colorBgLayout,
  };

  // 卡片样式 / Card style
  const cardStyle = {
    width: '100%',
    maxWidth: 480,
    borderRadius: token.borderRadiusLG,
    border: `1px solid ${token.colorBorder}`,
  };

  return (
    <div style={containerStyle}>
      <Card style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: token.paddingLG }}>
          <Title level={3} style={{ marginBottom: token.paddingXS }}>
            完善校友信息
          </Title>
          <Text type="secondary">
            填写您的校友信息，以便找到更多同学
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="真实姓名"
            name="real_name"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名，方便同学认出你" />
          </Form.Item>

          <Form.Item
            label="选择学校"
            name="school"
            rules={[{ required: true, message: '请选择学校' }]}
          >
            <SchoolSelect />
          </Form.Item>

          <Form.Item
            label="入学年份"
            name="enrollment_year"
            rules={[{ required: true, message: '请选择入学年份' }]}
          >
            <DatePicker
              picker="year"
              placeholder="请选择入学年份"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="毕业年份"
            name="graduation_year"
            rules={[{ required: true, message: '请选择毕业年份' }]}
          >
            <DatePicker
              picker="year"
              placeholder="请选择毕业年份"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="班级"
            name="class_name"
            rules={[{ required: true, message: '请输入班级' }]}
          >
            <Input placeholder="如：高三(1)班、初二5班" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: token.paddingLG }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              完成
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfileComplete;
