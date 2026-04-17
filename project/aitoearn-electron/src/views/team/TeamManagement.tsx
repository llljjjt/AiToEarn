/*
 * @Description: 团队管理页面
 */
import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Form,
  Input,
  Modal,
  Table,
  Space,
  message,
  Tag,
  Popconfirm,
  Descriptions,
} from 'antd';
import {
  TeamOutlined,
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useTeamStore } from '@/store/team';
import { IMember } from '@/api/types/team-t';
import dayjs from 'dayjs';

const TeamManagement: React.FC = () => {
  const {
    currentTeam,
    members,
    loading,
    getMyTeam,
    createTeam,
    updateTeam,
    addMember,
    removeMember,
  } = useTeamStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [addMemberForm] = Form.useForm();

  useEffect(() => {
    getMyTeam();
  }, []);

  // 创建团队
  const handleCreateTeam = async () => {
    try {
      const values = await createForm.validateFields();
      const result = await createTeam(values);
      if (result) {
        message.success('团队创建成功');
        setCreateModalVisible(false);
        createForm.resetFields();
      }
    } catch (error) {
      console.error('创建团队失败:', error);
    }
  };

  // 更新团队信息
  const handleUpdateTeam = async () => {
    if (!currentTeam) return;
    try {
      const values = await editForm.validateFields();
      const result = await updateTeam(currentTeam._id, values);
      if (result) {
        message.success('团队信息更新成功');
        setEditModalVisible(false);
      }
    } catch (error) {
      console.error('更新团队信息失败:', error);
    }
  };

  // 添加成员
  const handleAddMember = async () => {
    if (!currentTeam) return;
    try {
      const values = await addMemberForm.validateFields();
      const result = await addMember(currentTeam._id, values.userId);
      if (result) {
        message.success('成员添加成功');
        setAddMemberModalVisible(false);
        addMemberForm.resetFields();
      }
    } catch (error) {
      console.error('添加成员失败:', error);
    }
  };

  // 移除成员
  const handleRemoveMember = async (memberId: string) => {
    const result = await removeMember(memberId);
    if (result?.success) {
      message.success('成员移除成功');
    }
  };

  // 打开编辑弹窗
  const openEditModal = () => {
    if (currentTeam) {
      editForm.setFieldsValue({
        name: currentTeam.name,
        description: currentTeam.description,
        feishuWebhook: currentTeam.feishuWebhook,
      });
      setEditModalVisible(true);
    }
  };

  // 成员表格列
  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 200,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '活跃' : '已停用'}
        </Tag>
      ),
    },
    {
      title: '加入时间',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: IMember) => (
        <Space>
          <Popconfirm
            title="确定要移除该成员吗？"
            onConfirm={() => handleRemoveMember(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              移除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* 团队信息卡片 */}
      {currentTeam ? (
        <Card
          title={
            <Space>
              <TeamOutlined />
              <span>团队信息</span>
            </Space>
          }
          extra={
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={openEditModal}
            >
              编辑团队
            </Button>
          }
          style={{ marginBottom: 24 }}
        >
          <Descriptions column={2}>
            <Descriptions.Item label="团队名称">
              {currentTeam.name}
            </Descriptions.Item>
            <Descriptions.Item label="团队ID">
              {currentTeam._id}
            </Descriptions.Item>
            <Descriptions.Item label="团队描述" span={2}>
              {currentTeam.description || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="飞书 Webhook" span={2}>
              {currentTeam.feishuWebhook || '未配置'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {dayjs(currentTeam.createdAt).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="成员数量">
              {members.length} 人
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ) : (
        <Card style={{ marginBottom: 24, textAlign: 'center' }}>
          <div style={{ padding: '40px 0' }}>
            <TeamOutlined style={{ fontSize: 48, color: '#ccc' }} />
            <p style={{ marginTop: 16, color: '#999' }}>您还没有创建团队</p>
            <Button
              type="primary"
              size="large"
              onClick={() => setCreateModalVisible(true)}
            >
              创建团队
            </Button>
          </div>
        </Card>
      )}

      {/* 成员列表 */}
      {currentTeam && (
        <Card
          title={
            <Space>
              <UserAddOutlined />
              <span>团队成员</span>
            </Space>
          }
          extra={
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setAddMemberModalVisible(true)}
            >
              添加成员
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={members}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </Card>
      )}

      {/* 创建团队弹窗 */}
      <Modal
        title="创建团队"
        open={createModalVisible}
        onOk={handleCreateTeam}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        confirmLoading={loading}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            label="团队名称"
            name="name"
            rules={[{ required: true, message: '请输入团队名称' }]}
          >
            <Input placeholder="请输入团队名称" />
          </Form.Item>
          <Form.Item label="团队描述" name="description">
            <Input.TextArea
              placeholder="请输入团队描述"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
          <Form.Item label="飞书 Webhook" name="feishuWebhook">
            <Input placeholder="请输入飞书机器人 Webhook 地址" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑团队弹窗 */}
      <Modal
        title="编辑团队信息"
        open={editModalVisible}
        onOk={handleUpdateTeam}
        onCancel={() => setEditModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="团队名称"
            name="name"
            rules={[{ required: true, message: '请输入团队名称' }]}
          >
            <Input placeholder="请输入团队名称" />
          </Form.Item>
          <Form.Item label="团队描述" name="description">
            <Input.TextArea
              placeholder="请输入团队描述"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
          <Form.Item label="飞书 Webhook" name="feishuWebhook">
            <Input placeholder="请输入飞书机器人 Webhook 地址" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加成员弹窗 */}
      <Modal
        title="添加成员"
        open={addMemberModalVisible}
        onOk={handleAddMember}
        onCancel={() => {
          setAddMemberModalVisible(false);
          addMemberForm.resetFields();
        }}
        confirmLoading={loading}
      >
        <Form form={addMemberForm} layout="vertical">
          <Form.Item
            label="用户ID"
            name="userId"
            rules={[{ required: true, message: '请输入用户ID' }]}
          >
            <Input placeholder="请输入要添加的用户ID" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamManagement;
