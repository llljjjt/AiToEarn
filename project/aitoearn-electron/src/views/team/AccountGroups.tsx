/*
 * @Description: 账号分组管理页面
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
  Select,
  Avatar,
  Tooltip,
} from 'antd';
import {
  AppstoreOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { useAccountGroupStore } from '@/store/accountGroup';
import { useTeamStore } from '@/store/team';
import { ITeamAccountGroup, IGroupAccount } from '@/api/types/team-t';
import dayjs from 'dayjs';

const { Option } = Select;

// 平台配置
const PLATFORMS = [
  { value: 'douyin', label: '抖音', color: '#000000' },
  { value: 'xiaohongshu', label: '小红书', color: '#ff2442' },
  { value: 'kuaishou', label: '快手', color: '#ff6600' },
  { value: 'bilibili', label: 'B站', color: '#00a1d6' },
  { value: 'weixin', label: '微信公众号', color: '#07c160' },
];

const AccountGroups: React.FC = () => {
  const { currentTeam } = useTeamStore();
  const {
    groups,
    loading,
    loadGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    addAccountToGroup,
    removeAccountFromGroup,
  } = useAccountGroupStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addAccountModalVisible, setAddAccountModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ITeamAccountGroup | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [addAccountForm] = Form.useForm();

  useEffect(() => {
    if (currentTeam) {
      loadGroups(currentTeam._id);
    }
  }, [currentTeam]);

  // 创建分组
  const handleCreateGroup = async () => {
    if (!currentTeam) return;
    try {
      const values = await createForm.validateFields();
      const result = await createGroup({
        teamId: currentTeam._id,
        ...values,
      });
      if (result) {
        message.success('分组创建成功');
        setCreateModalVisible(false);
        createForm.resetFields();
      }
    } catch (error) {
      console.error('创建分组失败:', error);
    }
  };

  // 更新分组
  const handleUpdateGroup = async () => {
    if (!selectedGroup) return;
    try {
      const values = await editForm.validateFields();
      const result = await updateGroup(selectedGroup._id, values);
      if (result) {
        message.success('分组更新成功');
        setEditModalVisible(false);
        setSelectedGroup(null);
      }
    } catch (error) {
      console.error('更新分组失败:', error);
    }
  };

  // 删除分组
  const handleDeleteGroup = async (groupId: string) => {
    const result = await deleteGroup(groupId);
    if (result?.success) {
      message.success('分组删除成功');
    }
  };

  // 添加账号到分组
  const handleAddAccount = async () => {
    if (!selectedGroup) return;
    try {
      const values = await addAccountForm.validateFields();
      const result = await addAccountToGroup(selectedGroup._id, values);
      if (result) {
        message.success('账号添加成功');
        setAddAccountModalVisible(false);
        addAccountForm.resetFields();
        setSelectedGroup(result);
      }
    } catch (error) {
      console.error('添加账号失败:', error);
    }
  };

  // 从分组移除账号
  const handleRemoveAccount = async (groupId: string, accountId: string) => {
    const result = await removeAccountFromGroup(groupId, accountId);
    if (result) {
      message.success('账号移除成功');
      setSelectedGroup(result);
    }
  };

  // 打开编辑弹窗
  const openEditModal = (group: ITeamAccountGroup) => {
    setSelectedGroup(group);
    editForm.setFieldsValue({
      name: group.name,
      description: group.description,
    });
    setEditModalVisible(true);
  };

  // 打开添加账号弹窗
  const openAddAccountModal = (group: ITeamAccountGroup) => {
    setSelectedGroup(group);
    setAddAccountModalVisible(true);
  };

  // 获取平台标签颜色
  const getPlatformColor = (platform: string) => {
    return PLATFORMS.find(p => p.value === platform)?.color || '#1890ff';
  };

  // 获取平台名称
  const getPlatformLabel = (platform: string) => {
    return PLATFORMS.find(p => p.value === platform)?.label || platform;
  };

  // 分组表格列
  const columns = [
    {
      title: '分组名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
      render: (platform: string) => (
        <Tag color={getPlatformColor(platform)}>
          {getPlatformLabel(platform)}
        </Tag>
      ),
    },
    {
      title: '账号数量',
      dataIndex: 'accounts',
      key: 'accountCount',
      width: 100,
      render: (accounts: IGroupAccount[]) => accounts?.length || 0,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: ITeamAccountGroup) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<UserAddOutlined />}
            onClick={() => openAddAccountModal(record)}
          >
            添加账号
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该分组吗？"
            onConfirm={() => handleDeleteGroup(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 展开行渲染（显示账号列表）
  const expandedRowRender = (record: ITeamAccountGroup) => {
    const accountColumns = [
      {
        title: '账号ID',
        dataIndex: 'accountId',
        key: 'accountId',
        width: 200,
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        render: (text: string, account: IGroupAccount) => (
          <Space>
            {account.avatar && (
              <Avatar src={account.avatar} size="small" />
            )}
            <span>{text || '-'}</span>
          </Space>
        ),
      },
      {
        title: '添加时间',
        dataIndex: 'addedAt',
        key: 'addedAt',
        width: 180,
        render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        render: (_: any, account: IGroupAccount) => (
          <Popconfirm
            title="确定要移除该账号吗？"
            onConfirm={() => handleRemoveAccount(record._id, account.accountId)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              size="small"
              icon={<UserDeleteOutlined />}
            >
              移除
            </Button>
          </Popconfirm>
        ),
      },
    ];

    return (
      <Table
        columns={accountColumns}
        dataSource={record.accounts || []}
        rowKey="accountId"
        pagination={false}
        size="small"
      />
    );
  };

  if (!currentTeam) {
    return (
      <div style={{ padding: '24px' }}>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ padding: '40px 0' }}>
            <AppstoreOutlined style={{ fontSize: 48, color: '#ccc' }} />
            <p style={{ marginTop: 16, color: '#999' }}>请先创建或选择团队</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <AppstoreOutlined />
            <span>账号分组管理</span>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            创建分组
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={groups}
          rowKey="_id"
          loading={loading}
          expandable={{
            expandedRowRender,
            rowExpandable: (record) => (record.accounts?.length || 0) > 0,
          }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建分组弹窗 */}
      <Modal
        title="创建账号分组"
        open={createModalVisible}
        onOk={handleCreateGroup}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        confirmLoading={loading}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            label="分组名称"
            name="name"
            rules={[{ required: true, message: '请输入分组名称' }]}
          >
            <Input placeholder="请输入分组名称" />
          </Form.Item>
          <Form.Item
            label="平台"
            name="platform"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <Select placeholder="请选择平台">
              {PLATFORMS.map(platform => (
                <Option key={platform.value} value={platform.value}>
                  <Tag color={platform.color}>{platform.label}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea
              placeholder="请输入分组描述"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑分组弹窗 */}
      <Modal
        title="编辑分组信息"
        open={editModalVisible}
        onOk={handleUpdateGroup}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedGroup(null);
        }}
        confirmLoading={loading}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="分组名称"
            name="name"
            rules={[{ required: true, message: '请输入分组名称' }]}
          >
            <Input placeholder="请输入分组名称" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea
              placeholder="请输入分组描述"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加账号弹窗 */}
      <Modal
        title="添加账号到分组"
        open={addAccountModalVisible}
        onOk={handleAddAccount}
        onCancel={() => {
          setAddAccountModalVisible(false);
          addAccountForm.resetFields();
          setSelectedGroup(null);
        }}
        confirmLoading={loading}
      >
        <Form form={addAccountForm} layout="vertical">
          <Form.Item
            label="账号ID"
            name="accountId"
            rules={[{ required: true, message: '请输入账号ID' }]}
          >
            <Input placeholder="请输入账号ID" />
          </Form.Item>
          <Form.Item label="昵称" name="nickname">
            <Input placeholder="请输入账号昵称（可选）" />
          </Form.Item>
          <Form.Item label="头像URL" name="avatar">
            <Input placeholder="请输入头像URL（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AccountGroups;
