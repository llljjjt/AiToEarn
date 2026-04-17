/*
 * @Description: 数据看板页面
 */
import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Space,
  Table,
  Tabs,
  Select,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  UserAddOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useAnalyticsStore } from '@/store/analytics';
import { useTeamStore } from '@/store/team';
import { IAccountCompare, IPlatformStats } from '@/api/types/team-t';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const AnalyticsDashboard: React.FC = () => {
  const { currentTeam } = useTeamStore();
  const {
    dailyReport,
    weeklyReport,
    monthlyReport,
    accountComparison,
    platformStats,
    loading,
    getDailyReport,
    getWeeklyReport,
    getMonthlyReport,
    getAccountComparison,
    getPlatformStats,
  } = useAnalyticsStore();

  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(7, 'day'),
    dayjs(),
  ]);

  useEffect(() => {
    if (currentTeam) {
      loadReportData();
      loadComparisonData();
    }
  }, [currentTeam, reportType, selectedDate]);

  // 加载报表数据
  const loadReportData = () => {
    if (!currentTeam) return;

    switch (reportType) {
      case 'daily':
        getDailyReport(currentTeam._id, selectedDate.format('YYYY-MM-DD'));
        break;
      case 'weekly':
        getWeeklyReport(currentTeam._id, selectedDate.format('YYYY-MM-DD'));
        break;
      case 'monthly':
        getMonthlyReport(
          currentTeam._id,
          selectedDate.year(),
          selectedDate.month() + 1,
        );
        break;
    }
  };

  // 加载对比数据
  const loadComparisonData = () => {
    if (!currentTeam) return;
    getAccountComparison(
      currentTeam._id,
      dateRange[0].format('YYYY-MM-DD'),
      dateRange[1].format('YYYY-MM-DD'),
    );
    getPlatformStats(
      currentTeam._id,
      dateRange[0].format('YYYY-MM-DD'),
      dateRange[1].format('YYYY-MM-DD'),
    );
  };

  // 获取当前报表数据
  const getCurrentReport = () => {
    switch (reportType) {
      case 'daily':
        return dailyReport;
      case 'weekly':
        return weeklyReport;
      case 'monthly':
        return monthlyReport;
      default:
        return null;
    }
  };

  const currentReport = getCurrentReport();

  // 账号对比表格列
  const accountColumns = [
    {
      title: '账号名称',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 150,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
    },
    {
      title: '发布数',
      dataIndex: 'publishCount',
      key: 'publishCount',
      width: 100,
      sorter: (a: IAccountCompare, b: IAccountCompare) => a.publishCount - b.publishCount,
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 120,
      sorter: (a: IAccountCompare, b: IAccountCompare) => a.viewCount - b.viewCount,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 120,
      sorter: (a: IAccountCompare, b: IAccountCompare) => a.likeCount - b.likeCount,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '评论数',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: 120,
      sorter: (a: IAccountCompare, b: IAccountCompare) => a.commentCount - b.commentCount,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '分享数',
      dataIndex: 'shareCount',
      key: 'shareCount',
      width: 120,
      sorter: (a: IAccountCompare, b: IAccountCompare) => a.shareCount - b.shareCount,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '粉丝增长',
      dataIndex: 'followerGrowth',
      key: 'followerGrowth',
      width: 120,
      sorter: (a: IAccountCompare, b: IAccountCompare) => a.followerGrowth - b.followerGrowth,
      render: (val: number) => (
        <span style={{ color: val >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {val >= 0 ? '+' : ''}{val.toLocaleString()}
        </span>
      ),
    },
  ];

  // 平台统计表格列
  const platformColumns = [
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
    },
    {
      title: '账号数',
      dataIndex: 'accountCount',
      key: 'accountCount',
      width: 100,
    },
    {
      title: '发布数',
      dataIndex: 'publishCount',
      key: 'publishCount',
      width: 100,
    },
    {
      title: '浏览量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 120,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 120,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '评论数',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: 120,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: '分享数',
      dataIndex: 'shareCount',
      key: 'shareCount',
      width: 120,
      render: (val: number) => val.toLocaleString(),
    },
  ];

  if (!currentTeam) {
    return (
      <div style={{ padding: '24px' }}>
        <Card style={{ textAlign: 'center' }}>
          <div style={{ padding: '40px 0' }}>
            <FileTextOutlined style={{ fontSize: 48, color: '#ccc' }} />
            <p style={{ marginTop: 16, color: '#999' }}>请先创建或选择团队</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 报表类型选择 */}
      <Card style={{ marginBottom: 24 }}>
        <Space size="large">
          <Select
            value={reportType}
            onChange={setReportType}
            style={{ width: 120 }}
          >
            <Option value="daily">日报</Option>
            <Option value="weekly">周报</Option>
            <Option value="monthly">月报</Option>
          </Select>
          <DatePicker
            value={selectedDate}
            onChange={(date) => date && setSelectedDate(date)}
            picker={reportType === 'monthly' ? 'month' : 'date'}
            format={reportType === 'monthly' ? 'YYYY-MM' : 'YYYY-MM-DD'}
          />
        </Space>
      </Card>

      {/* 核心数据统计 */}
      {currentReport && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card>
              <Statistic
                title="发布数"
                value={currentReport.totalPublish}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="浏览量"
                value={currentReport.totalView}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="点赞数"
                value={currentReport.totalLike}
                prefix={<LikeOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="评论数"
                value={currentReport.totalComment}
                prefix={<MessageOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="分享数"
                value={currentReport.totalShare}
                prefix={<ShareAltOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="粉丝增长"
                value={currentReport.totalFollowerGrowth}
                prefix={
                  currentReport.totalFollowerGrowth >= 0 ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )
                }
                valueStyle={{
                  color: currentReport.totalFollowerGrowth >= 0 ? '#52c41a' : '#ff4d4f',
                }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 详细数据 */}
      <Card>
        <Tabs defaultActiveKey="account">
          <TabPane tab="账号对比" key="account">
            <Space style={{ marginBottom: 16 }}>
              <span>时间范围：</span>
              <RangePicker
                value={dateRange}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([dates[0], dates[1]]);
                    if (currentTeam) {
                      getAccountComparison(
                        currentTeam._id,
                        dates[0].format('YYYY-MM-DD'),
                        dates[1].format('YYYY-MM-DD'),
                      );
                    }
                  }
                }}
              />
            </Space>
            <Table
              columns={accountColumns}
              dataSource={accountComparison}
              rowKey="accountId"
              loading={loading}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
          </TabPane>
          <TabPane tab="平台统计" key="platform">
            <Space style={{ marginBottom: 16 }}>
              <span>时间范围：</span>
              <RangePicker
                value={dateRange}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([dates[0], dates[1]]);
                    if (currentTeam) {
                      getPlatformStats(
                        currentTeam._id,
                        dates[0].format('YYYY-MM-DD'),
                        dates[1].format('YYYY-MM-DD'),
                      );
                    }
                  }
                }}
              />
            </Space>
            <Table
              columns={platformColumns}
              dataSource={platformStats}
              rowKey="platform"
              loading={loading}
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
