/**
 * 举报弹窗组件 / Report Modal Component
 */

import { useState } from 'react';
import { Modal, Form, Input, Radio, message, theme } from 'antd';
import { submitReport } from '../../services/report';

const REPORT_REASONS = [
  { value: '垃圾广告', label: '垃圾广告' },
  { value: '色情低俗', label: '色情低俗' },
  { value: '人身攻击', label: '人身攻击' },
  { value: '违法违规', label: '违法违规' },
  { value: '其他', label: '其他' },
];

const ReportModal = ({ open, onCancel, targetType, targetId }) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const handleSubmit = async (values) => {
    const reason = values.reason === '其他' ? values.customReason : values.reason;
    if (!reason?.trim()) {
      message.error('请填写举报原因');
      return;
    }

    setLoading(true);
    const res = await submitReport({
      target_type: targetType,
      target_id: targetId,
      reason: reason.trim(),
    });

    if (res?.code === 201) {
      message.success('举报成功，我们会尽快处理');
      form.resetFields();
      setShowCustom(false);
      onCancel();
    }
    setLoading(false);
  };

  const handleReasonChange = (e) => {
    setShowCustom(e.target.value === '其他');
  };

  const handleCancel = () => {
    form.resetFields();
    setShowCustom(false);
    onCancel();
  };

  return (
    <Modal
      title="举报"
      open={open}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="提交举报"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="reason"
          label="举报原因"
          rules={[{ required: true, message: '请选择举报原因' }]}
        >
          <Radio.Group onChange={handleReasonChange}>
            {REPORT_REASONS.map(item => (
              <Radio
                key={item.value}
                value={item.value}
                style={{ display: 'block', marginBottom: token.paddingXS }}
              >
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>

        {showCustom && (
          <Form.Item
            name="customReason"
            rules={[{ required: true, message: '请填写具体原因' }]}
          >
            <Input.TextArea
              placeholder="请详细描述举报原因"
              maxLength={500}
              rows={3}
              showCount
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ReportModal;
