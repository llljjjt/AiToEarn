/*
 * @Description: 任务管理页面
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
  DatePicker,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useTaskStore } from '@/store/task';
import { useTeamStore } from '@/store/team';
import { ITask } from '@/api/types/team-t';
import dayjs from 'dayjs';

const { Option } = Select;

// 任务状态配置
const TASK_STATUS = [
  { value: 'pending', label: '待处理', color: 'default', icon: <ClockCircleOutlined /> },
  { value: 'in_progress', label: '进行中', color: 'processing', icon: <SyncOutlined spin /> },
  { value: 'completed', label: '已完成', color: 'success', icon: <CheckCircleOutlined /> },
  { value: 'cancelled', label: '已取消', color: 'error', icon: <CloseCircleOutlined /> },
];

// 优先级配置
const PRIORITY_CONFIG = [
  { value: 'low', label: '低', color: 'default' },
  { value: 'medium', label: '中', color: 'warning' },
  { value: 'high', label: '高', color: 'error' },
];

const TaskManagement: React.FC = () => {
  const { currentTeam, members } = useTeamStore();
  const {
    tasks,
    stats,
    loading,
    loadTasks,
    loadStats,
    createTask,
    updateTask,
    completeTask,
    deleteTask,
  } = useTaskStore();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (currentTeam) {
      loadTasks(currentTeam._id);
      loadStats(currentTeam._id);
    }
  }, [currentTeam]);

  // 创建任务
  const handleCreateTask = async () => {
    if (!currentTeam) return;
    try {
      const values = await createForm.validateFields();
      const result = await createTask({
        teamId: currentTeam._id,
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      });
      if (result) {
        message.success('任务创建成功');
        setCreateModalVisible(false);
        createForm.resetFields();
      }
    } catch (error) {
      console.error('创建任务失败:', error);
    }
  };

  // 更新任务
  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    try {
      const values = await editForm.validateFields();
      const result = await updateTask(selectedTask._id, {
        ...values,
        dueDate: values.dueDate ? values.dueDate.toISOString() : undefined,
      });
      if (result) {
        message.success('任务更新成功');
        setEditModalVisible(false);
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('更新任务失败:', error);
    }
  };

  // 完成任务
  const handleCompleteTask = async (taskId: string) => {
    const result = await completeTask(taskId);
    if (result) {
      message.success('任务已完成');
    }
  };

  // 删除任务
  const handleDeleteTask = async (taskId: string) => {
    if (!currentTeam) return;
    const result = await deleteTask(taskId, currentTeam._id);
    if (result?.success) {
      message.success('任务删除成功');
    }
  };

  // 打开编辑弹窗
  const openEditModal = (task: ITask) => {
    setSelectedTask(task);
    editForm.setFieldsValue({
      title: task.title,
      description: task.description,
      assigneeId: task.assigneeId,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? dayjs(task.dueDate) : null,
    });
    setEditModalVisible(true);
  };

  // 筛选任务
  const handleFilterChange = (status: string | undefined) => {
    setFilterStatus(status);
    if (currentTeam) {
      loadTasks(currentTeam._id, status ? { status } : undefined);
    }
  };

  // 获取状态配置
  const getStatusConfig = (status: string) => {
    return TASK_STATUS.find(s => s.value === status) || TASK_STATUS[0];
  };

  // 获取优先级配置
  const getPriorityConfig = (priority: string) => {
    return PRIORITY_CONFIG.find(p => p.value === priority) || PRIORITY_CONFIG[0];
  };

  // 任务表格列
  const columns = [
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '负责人',
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      width: 120,
      render: (text: string) => text || '未分配',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = getStatusConfig(status);
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => {
        const config = getPriorityConfig(priority);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '截止时间',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 180,
      render: (text: string) => {
        if (!text) return '-';
        const isOverdue = dayjs(text).isBefore(dayjs()) && selectedTask?.status !== 'completed';
        return (
          <span style={{ color: isOverdue ? '#ff4d4f' : undefined }}>
            {dayjs(text).format('YYYY-MM-DD HH:mm')}
            {isOverdue && ' (已逾期)'}
          </span>
        );
      },
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
      fixed: 'right' as const,
      render: (_: any, record: ITask) => (
        <Space>
          {record.status !== 'completed' && (
            <Button
              type="link"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleCompleteTask(record._id)}
            >
              完成
            </Button>
          )}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该任务吗？"
            onConfirm={() => handleDeleteTask(record._id)}
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

  if (!currentTeam) {
    return (
      <div style={{ padding: '24px' }}>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ padding: '40px 0' }}>
            <ClockCircleOutlined style={{ fontSize: 48, color: '#ccc' }} />
            <p style={{ marginTop: 16, color: '#999' }}>请先创建或选择团队</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 统计卡片 */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总任务数"
                value={stats.total}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="待处理"
                value={stats.pending}
                valueStyle={{ color: '#faad14' }}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="进行中"
                value={stats.inProgress}
                valueStyle={{ color: '#1890ff' }}
                prefix={<SyncOutlined spin />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="已完成"
                value={stats.completed}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 任务列表 */}
      <Card
        title="任务列表"
        extra={
          <Space>
            <Select
              placeholder="筛选状态"
              style={{ width: 120 }}
              allowClear
              value={filterStatus}
              onChange={handleFilterChange}
            >
              {TASK_STATUS.map(status => (
                <Option key={status.value} value={status.value}>
                  {status.label}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
            >
              创建任务
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={tasks}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建任务弹窗 */}
      <Modal
        title="创建任务"
        open={createModalVisible}
        onOk={handleCreateTask}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        confirmLoading={loading}
        width={600}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            label="任务标题"
            name="title"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="请输入任务标题" />
          </Form.Item>
          <Form.Item label="任务描述" name="description">
            <Input.TextArea
              placeholder="请输入任务描述"
              rows={3}
              maxLength={500}
              showCount
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="负责人" name="assigneeId">
                <Select placeholder="请选择负责人" allowClear>
                  {members.map(member => (
                    <Option key={member.userId} value={member.userId}>
                      {member.userName || member.userId}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="优先级" name="priority" initialValue="medium">
                <Select placeholder="请选择优先级">
                  {PRIORITY_CONFIG.map(priority => (
                    <Option key={priority.value} value={priority.value}>
                      <Tag color={priority.color}>{priority.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="截止时间" name="dueDate">
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              placeholder="请选择截止时间"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑任务弹窗 */}
      <Modal
        title="编辑任务"
        open={editModalVisible}
        onOk={handleUpdateTask}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedTask(null);
        }}
        confirmLoading={loading}
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="任务标题"
            name="title"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="请输入任务标题" />
          </Form.Item>
          <Form.Item label="任务描述" name="description">
            <Input.TextArea
              placeholder="请输入任务描述"
              rows={3}
              maxLength={500}
              showCount
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="负责人" name="assigneeId">
                <Select placeholder="请选择负责人" allowClear>
                  {members.map(member => (
                    <Option key={member.userId} value={member.userId}>
                      {member.userName || member.userId}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请选择状态">
                  {TASK_STATUS.map(status => (
                    <Option key={status.value} value={status.value}>
                      {status.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="优先级" name="priority">
                <Select placeholder="请选择优先级">
                  {PRIORITY_CONFIG.map(priority => (
                    <Option key={priority.value} value={priority.value}>
                      <Tag color={priority.color}>{priority.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="截止时间" name="dueDate">
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: '100%' }}
                  placeholder="请选择截止时间"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default TaskManagement;
