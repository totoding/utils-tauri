import { useEffect } from 'react';
import { Modal, Form, Input } from '@arco-design/web-react';
import type { ProjectRow } from './index';

interface ProjectFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ProjectRow, 'id'>) => void;
  initialValues?: ProjectRow; // 新增：用于编辑时的初始值
}

export default function ProjectForm({ visible, onClose, onSubmit, initialValues }: ProjectFormProps) {
  const [form] = Form.useForm();

  // 当表单显示且有初始值时，设置表单值
  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = () => {
    form.validate().then((values) => {
      onSubmit(values);
      form.resetFields();
    }).catch(console.error);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={initialValues ? '编辑项目' : '新建项目'}
      visible={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={initialValues ? '更新' : '创建'}
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="项目名称"
          field="name"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input placeholder="请输入项目名称" />
        </Form.Item>
        <Form.Item
          label="项目描述"
          field="desc"
        >
          <Input.TextArea placeholder="请输入项目描述" rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}