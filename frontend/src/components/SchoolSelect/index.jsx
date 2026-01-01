/**
 * 学校选择器组件 / School Select Component
 * 支持省市联动筛选和学校搜索 / Supports province-city cascade and school search
 */

import { useState, useEffect } from 'react';
import { Select, Space, Button, Modal, Form, Input, message, theme } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getProvinces, getCities, searchSchools, createSchool } from '../../services/school';

const SchoolSelect = ({ value, onChange, disabled = false }) => {
  const { token } = theme.useToken();

  // 省市学校数据 / Province, city, school data
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);

  // 选中的省市 / Selected province and city
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // 加载状态 / Loading states
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);

  // 新增学校弹窗 / Add school modal
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 加载省份列表 / Load provinces
  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    setLoadingProvinces(true);
    const res = await getProvinces();
    if (res?.code === 0) {
      setProvinces(res.data.map(p => ({ label: p, value: p })));
    }
    setLoadingProvinces(false);
  };

  // 省份变化时加载城市 / Load cities when province changes
  const handleProvinceChange = async (province) => {
    setSelectedProvince(province);
    setSelectedCity(null);
    setSchools([]);
    onChange?.(null);

    if (!province) {
      setCities([]);
      return;
    }

    setLoadingCities(true);
    const res = await getCities(province);
    if (res?.code === 0) {
      setCities(res.data.map(c => ({ label: c, value: c })));
    }
    setLoadingCities(false);
  };

  // 城市变化时加载学校 / Load schools when city changes
  const handleCityChange = async (city) => {
    setSelectedCity(city);
    onChange?.(null);

    if (!city) {
      setSchools([]);
      return;
    }

    setLoadingSchools(true);
    const res = await searchSchools({
      province: selectedProvince,
      city: city,
      page_size: 100,
    });
    if (res?.code === 0) {
      setSchools(res.data.results.map(s => ({
        label: s.name,
        value: s.id,
        school: s,
      })));
    }
    setLoadingSchools(false);
  };

  // 学校变化 / School change
  const handleSchoolChange = (schoolId) => {
    const school = schools.find(s => s.value === schoolId)?.school;
    onChange?.(school || null);
  };

  // 打开新增学校弹窗 / Open add school modal
  const openAddModal = () => {
    form.setFieldsValue({
      province: selectedProvince,
      city: selectedCity,
      name: '',
      school_type: 'senior',
    });
    setModalVisible(true);
  };

  // 提交新增学校 / Submit new school
  const handleAddSchool = async () => {
    const values = await form.validateFields();
    const res = await createSchool(values);
    if (res?.code === 0) {
      message.success('添加成功');
      setModalVisible(false);
      await handleCityChange(selectedCity);
      onChange?.(res.data);
    }
  };

  return (
    <>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* 省份选择 / Province select */}
        <Select
          placeholder="请选择省份"
          options={provinces}
          value={selectedProvince}
          onChange={handleProvinceChange}
          loading={loadingProvinces}
          disabled={disabled}
          showSearch
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          style={{ width: '100%' }}
        />

        {/* 城市选择 / City select */}
        <Select
          placeholder="请选择城市"
          options={cities}
          value={selectedCity}
          onChange={handleCityChange}
          loading={loadingCities}
          disabled={disabled || !selectedProvince}
          showSearch
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          style={{ width: '100%' }}
        />

        {/* 学校选择 / School select */}
        <Select
          placeholder="请选择学校"
          options={schools}
          value={value?.id}
          onChange={handleSchoolChange}
          loading={loadingSchools}
          disabled={disabled || !selectedCity}
          showSearch
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          style={{ width: '100%' }}
          notFoundContent={
            selectedCity ? (
              <div style={{ textAlign: 'center', padding: token.padding }}>
                <p style={{ color: token.colorTextSecondary }}>未找到学校</p>
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={openAddModal}
                >
                  添加新学校
                </Button>
              </div>
            ) : null
          }
          dropdownRender={(menu) => (
            <>
              {menu}
              {schools.length > 0 && (
                <div style={{
                  padding: token.paddingSM,
                  borderTop: `1px solid ${token.colorBorderSecondary}`,
                }}>
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    onClick={openAddModal}
                    style={{ width: '100%' }}
                  >
                    找不到？添加新学校
                  </Button>
                </div>
              )}
            </>
          )}
        />
      </Space>

      {/* 新增学校弹窗 / Add school modal */}
      <Modal
        title="添加新学校"
        open={modalVisible}
        onOk={handleAddSchool}
        onCancel={() => setModalVisible(false)}
        okText="添加"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="省份" name="province">
            <Input disabled />
          </Form.Item>
          <Form.Item label="城市" name="city">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="学校名称"
            name="name"
            rules={[{ required: true, message: '请输入学校名称' }]}
          >
            <Input placeholder="请输入完整的学校名称" />
          </Form.Item>
          <Form.Item
            label="学校类型"
            name="school_type"
            rules={[{ required: true, message: '请选择学校类型' }]}
          >
            <Select
              options={[
                { label: '初中', value: 'junior' },
                { label: '高中', value: 'senior' },
                { label: '完全中学（初高中一体）', value: 'combined' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SchoolSelect;
