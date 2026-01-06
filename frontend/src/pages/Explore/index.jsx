/**
 * 探索页面 - 校友搜索 / Explore Page - User Search
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Form, Select, Input, Button, List, Avatar, Empty, Spin, theme, Typography
} from 'antd';
import { SearchOutlined, UserOutlined, UserAddOutlined } from '@ant-design/icons';
import { searchSchools } from '../../services/school';
import { searchUsers } from '../../services/user';
import { sendFriendRequest } from '../../services/friend';

const { Text } = Typography;

const Explore = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [schoolOptions, setSchoolOptions] = useState([]);
  const [schoolLoading, setSchoolLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  // 搜索学校 / Search schools
  const handleSchoolSearch = async (value) => {
    if (!value || value.length < 2) {
      setSchoolOptions([]);
      return;
    }
    setSchoolLoading(true);
    const res = await searchSchools({ keyword: value });
    if (res?.code === 200) {
      setSchoolOptions(res.data?.results || []);
    }
    setSchoolLoading(false);
  };

  // 搜索校友 / Search users
  const handleSearch = async (values) => {
    setSearching(true);
    setSearched(true);
    const res = await searchUsers({
      school_id: values.school_id,
      graduation_year: values.graduation_year || undefined,
      class_name: values.class_name || undefined,
      name: values.name || undefined,
    });
    if (res?.code === 200) {
      setResults(res.data?.results || []);
    }
    setSearching(false);
  };

  // 查看用户主页 / View user profile
  const handleViewUser = (userId) => {
    navigate(`/user/${userId}`);
  };

  // 生成毕业年份选项 / Generate graduation year options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      {/* 搜索表单 / Search form */}
      <Card
        title={<span><SearchOutlined style={{ marginRight: 8 }} />校友搜索</span>}
        style={{
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorder}`,
          marginBottom: token.padding,
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSearch}>
          <Form.Item
            name="school_id"
            label="学校"
            rules={[{ required: true, message: '请选择学校' }]}
          >
            <Select
              showSearch
              placeholder="输入学校名称搜索"
              filterOption={false}
              onSearch={handleSchoolSearch}
              loading={schoolLoading}
              notFoundContent={schoolLoading ? <Spin size="small" /> : null}
              options={schoolOptions.map(s => ({ value: s.id, label: s.name }))}
            />
          </Form.Item>

          <Form.Item name="graduation_year" label="毕业年份">
            <Select placeholder="选择毕业年份" allowClear>
              {yearOptions.map(year => (
                <Select.Option key={year} value={year}>{year}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="class_name" label="班级">
            <Input placeholder="如：高三1班" />
          </Form.Item>

          <Form.Item name="name" label="姓名">
            <Input placeholder="支持模糊搜索" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={searching} block>
              搜索
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 搜索结果 / Search results */}
      {searched && (
        <Card
          title="搜索结果"
          style={{
            borderRadius: token.borderRadiusLG,
            border: `1px solid ${token.colorBorder}`,
          }}
          bodyStyle={{ padding: 0 }}
        >
          {searching ? (
            <div style={{ textAlign: 'center', padding: token.paddingLG * 2 }}>
              <Spin />
            </div>
          ) : results.length === 0 ? (
            <Empty description="未找到匹配的校友" style={{ padding: token.paddingLG * 2 }} />
          ) : (
            <List
              dataSource={results}
              renderItem={(item) => (
                <List.Item
                  style={{ padding: `${token.padding}px ${token.paddingLG}px`, cursor: 'pointer' }}
                  onClick={() => handleViewUser(item.user_id)}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.avatar}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: token.colorPrimary }}
                      />
                    }
                    title={item.real_name || item.username}
                    description={
                      <Text type="secondary">
                        {item.school_name} · {item.graduation_year}届 · {item.class_name}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default Explore;
