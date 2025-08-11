import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Dropdown, 
  Popconfirm, 
  Statistic, 
  Row, 
  Col,
  Typography,
  message,
  Tag,
  Divider,
  Select,
  Badge,
  Tooltip,
  Empty
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  SearchOutlined,
  ReloadOutlined,
  TagsOutlined,
  AppstoreOutlined,
  FilterOutlined,
  ClearOutlined,
  EyeOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { api } from '../api/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const CategoryUnit = () => {
  const { user, isAdmin } = useAuth();
  
  // Categories State
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [viewCategoryModalVisible, setViewCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [categoryForm] = Form.useForm();
  const [categorySearchText, setCategorySearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Units State
  const [units, setUnits] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [viewUnitModalVisible, setViewUnitModalVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [viewingUnit, setViewingUnit] = useState(null);
  const [unitForm] = Form.useForm();
  const [unitSearchText, setUnitSearchText] = useState('');
  const [unitFilter, setUnitFilter] = useState('all');

  // Stats State
  const [stats, setStats] = useState({
    totalCategories: 0,
    userCategories: 0,
    totalUnits: 0,
    userUnits: 0
  });

  useEffect(() => {
    loadCategories();
    loadUnits();
  }, []);

  // Category Functions
  const loadCategories = async () => {
    setCategoriesLoading(true);
    try {
      let response;
      if (isAdmin) {
        // Admin can see all categories
        response = await api.get('/categories/admin/all');
      } else {
        // Regular user sees only their categories
        response = await api.get('/categories/user');
      }
      
      if (response.data.success) {
        setCategories(response.data.data);
        updateStats('categories', response.data.data);
        toast.success('Categories loaded successfully');
      }
    } catch (error) {
      toast.error('Failed to load categories');
      console.error('Error loading categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadUnits = async () => {
    setUnitsLoading(true);
    try {
      const response = await api.get('/units');
      if (response.data.success) {
        setUnits(response.data.data);
        updateStats('units', response.data.data);
        toast.success('Units loaded successfully');
      }
    } catch (error) {
      toast.error('Failed to load units');
      console.error('Error loading units:', error);
    } finally {
      setUnitsLoading(false);
    }
  };

  const updateStats = (type, data) => {
    setStats(prev => {
      if (type === 'categories') {
        const userCategories = data.filter(cat => cat.created_by === user?._id);
        return {
          ...prev,
          totalCategories: data.length,
          userCategories: userCategories.length
        };
      } else if (type === 'units') {
        const userUnits = data.filter(unit => unit.created_by === user?._id);
        return {
          ...prev,
          totalUnits: data.length,
          userUnits: userUnits.length
        };
      }
      return prev;
    });
  };

  const handleCategorySubmit = async (values) => {
    const loadingToast = toast.loading(editingCategory ? 'Updating category...' : 'Creating category...');
    try {
      if (editingCategory) {
        // Update category
        const endpoint = isAdmin ? 
          `/categories/admin/${editingCategory._id}` : 
          `/categories/user/${editingCategory._id}`;
        
        const response = await api.patch(endpoint, values);
        if (response.data.success) {
          toast.success('Category updated successfully', { id: loadingToast });
          loadCategories();
        }
      } else {
        // Create category
        const response = await api.post('/categories', values);
        if (response.data.success) {
          toast.success('Category created successfully', { id: loadingToast });
          loadCategories();
        }
      }
      
      setCategoryModalVisible(false);
      categoryForm.resetFields();
      setEditingCategory(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Operation failed';
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  const handleUnitSubmit = async (values) => {
    const loadingToast = toast.loading(editingUnit ? 'Updating unit...' : 'Creating unit...');
    try {
      if (editingUnit) {
        // Update unit
        const response = await api.patch(`/units/${editingUnit._id}`, values);
        if (response.data.success) {
          toast.success('Unit updated successfully', { id: loadingToast });
          loadUnits();
        }
      } else {
        // Create unit
        const response = await api.post('/units', values);
        if (response.data.success) {
          toast.success('Unit created successfully', { id: loadingToast });
          loadUnits();
        }
      }
      
      setUnitModalVisible(false);
      unitForm.resetFields();
      setEditingUnit(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Operation failed';
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  const deleteCategory = async (categoryId) => {
    const loadingToast = toast.loading('Deleting category...');
    try {
      const endpoint = isAdmin ? 
        `/categories/admin/${categoryId}` : 
        `/categories/user/${categoryId}`;
      
      const response = await api.delete(endpoint);
      if (response.data.success) {
        toast.success('Category deleted successfully', { id: loadingToast });
        loadCategories();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete category';
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  const deleteUnit = async (unitId) => {
    const loadingToast = toast.loading('Deleting unit...');
    try {
      const response = await api.delete(`/units/${unitId}`);
      if (response.data.success) {
        toast.success('Unit deleted successfully', { id: loadingToast });
        loadUnits();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete unit';
      toast.error(errorMsg, { id: loadingToast });
    }
  };

  const openCategoryModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      categoryForm.setFieldsValue({
        category_name: category.category_name
      });
    } else {
      categoryForm.resetFields();
    }
    setCategoryModalVisible(true);
  };

  const openUnitModal = (unit = null) => {
    setEditingUnit(unit);
    if (unit) {
      unitForm.setFieldsValue({
        unit_name: unit.unit_name
      });
    } else {
      unitForm.resetFields();
    }
    setUnitModalVisible(true);
  };

  const viewCategoryDetails = (category) => {
    setViewingCategory(category);
    setViewCategoryModalVisible(true);
  };

  const viewUnitDetails = (unit) => {
    setViewingUnit(unit);
    setViewUnitModalVisible(true);
  };

  // Filter functions
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.category_name.toLowerCase().includes(categorySearchText.toLowerCase());
    const matchesFilter = categoryFilter === 'all' || 
                         (categoryFilter === 'mine' && category.created_by === user?._id) ||
                         (categoryFilter === 'others' && category.created_by !== user?._id);
    return matchesSearch && matchesFilter;
  });

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.unit_name.toLowerCase().includes(unitSearchText.toLowerCase());
    const matchesFilter = unitFilter === 'all' || 
                         (unitFilter === 'mine' && unit.created_by === user?._id) ||
                         (unitFilter === 'others' && unit.created_by !== user?._id);
    return matchesSearch && matchesFilter;
  });

  // Check permissions
  const canEditCategory = (category) => {
    return isAdmin || category.created_by === user?._id;
  };

  const canEditUnit = (unit) => {
    return isAdmin || unit.created_by === user?._id;
  };

  // Clear filters
  const clearCategoryFilters = () => {
    setCategorySearchText('');
    setCategoryFilter('all');
  };

  const clearUnitFilters = () => {
    setUnitSearchText('');
    setUnitFilter('all');
  };

  // Table columns
  const categoryColumns = [
    {
      title: 'Name',
      dataIndex: 'category_name',
      key: 'category_name',
      sorter: (a, b) => a.category_name.localeCompare(b.category_name),
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          <TagsOutlined className="text-blue-500" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      render: (createdBy) => (
        <Tag color={createdBy === user?._id ? 'green' : 'blue'} icon={<UserOutlined />}>
          {createdBy === user?._id ? 'You' : 'Other User'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div className="flex items-center space-x-1">
          <CalendarOutlined className="text-gray-400" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => {
        const items = [
          {
            key: 'view',
            label: 'View Details',
            icon: <EyeOutlined />,
            onClick: () => viewCategoryDetails(record),
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            disabled: !canEditCategory(record),
            onClick: () => openCategoryModal(record),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            disabled: !canEditCategory(record),
          },
        ];

        return (
          <Space>
            <Button 
              type="primary" 
              size="small" 
              icon={<EditOutlined />}
              disabled={!canEditCategory(record)}
              onClick={() => openCategoryModal(record)}
            >
              Edit
            </Button>
            <Dropdown
              menu={{
                items,
                onClick: (e) => {
                  if (e.key === 'delete') {
                    Modal.confirm({
                      title: 'Delete Category',
                      content: 'Are you sure you want to delete this category?',
                      okText: 'Yes',
                      okType: 'danger',
                      cancelText: 'No',
                      onOk: () => deleteCategory(record._id),
                    });
                  }
                },
              }}
              trigger={['click']}
            >
              <Button size="small" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const unitColumns = [
    {
      title: 'Name',
      dataIndex: 'unit_name',
      key: 'unit_name',
      sorter: (a, b) => a.unit_name.localeCompare(b.unit_name),
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          <AppstoreOutlined className="text-green-500" />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      render: (createdBy) => (
        <Tag color={createdBy === user?._id ? 'green' : 'blue'} icon={<UserOutlined />}>
          {createdBy === user?._id ? 'You' : 'Other User'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div className="flex items-center space-x-1">
          <CalendarOutlined className="text-gray-400" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      ),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => {
        const items = [
          {
            key: 'view',
            label: 'View Details',
            icon: <EyeOutlined />,
            onClick: () => viewUnitDetails(record),
          },
          {
            key: 'edit',
            label: 'Edit',
            icon: <EditOutlined />,
            disabled: !canEditUnit(record),
            onClick: () => openUnitModal(record),
          },
          {
            key: 'delete',
            label: 'Delete',
            icon: <DeleteOutlined />,
            danger: true,
            disabled: !canEditUnit(record),
          },
        ];

        return (
          <Space>
            <Button 
              type="primary" 
              size="small" 
              icon={<EditOutlined />}
              disabled={!canEditUnit(record)}
              onClick={() => openUnitModal(record)}
            >
              Edit
            </Button>
            <Dropdown
              menu={{
                items,
                onClick: (e) => {
                  if (e.key === 'delete') {
                    Modal.confirm({
                      title: 'Delete Unit',
                      content: 'Are you sure you want to delete this unit?',
                      okText: 'Yes',
                      okType: 'danger',
                      cancelText: 'No',
                      onOk: () => deleteUnit(record._id),
                    });
                  }
                },
              }}
              trigger={['click']}
            >
              <Button size="small" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="mb-2">Category & Unit Management</Title>
        <Text type="secondary">Manage your product categories and units</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Categories"
              value={stats.totalCategories}
              prefix={<TagsOutlined className="text-blue-500" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Your Categories"
              value={stats.userCategories}
              prefix={<TagsOutlined className="text-green-500" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Units"
              value={stats.totalUnits}
              prefix={<AppstoreOutlined className="text-purple-500" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Your Units"
              value={stats.userUnits}
              prefix={<AppstoreOutlined className="text-orange-500" />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Categories Section */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center space-x-2">
                <TagsOutlined className="text-blue-500" />
                <span>Categories</span>
                <Badge count={filteredCategories.length} showZero />
              </div>
            }
            extra={
              <Space>
                <Tooltip title="Refresh">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={loadCategories}
                    loading={categoriesLoading}
                  />
                </Tooltip>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openCategoryModal()}
                >
                  Add Category
                </Button>
              </Space>
            }
          >
            {/* Search and Filter */}
            <div className="mb-4 space-y-2">
              <Search
                placeholder="Search categories..."
                value={categorySearchText}
                onChange={(e) => setCategorySearchText(e.target.value)}
                allowClear
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <Select
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  className="w-32"
                  suffixIcon={<FilterOutlined />}
                >
                  <Option value="all">All</Option>
                  <Option value="mine">Mine</Option>
                  {isAdmin && <Option value="others">Others</Option>}
                </Select>
                <Button
                  size="small"
                  icon={<ClearOutlined />}
                  onClick={clearCategoryFilters}
                >
                  Clear
                </Button>
              </div>
            </div>

            <Table
              columns={categoryColumns}
              dataSource={filteredCategories}
              rowKey="_id"
              loading={categoriesLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} categories`,
              }}
              locale={{
                emptyText: (
                  <Empty
                    description="No categories found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              }}
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>

        {/* Units Section */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center space-x-2">
                <AppstoreOutlined className="text-green-500" />
                <span>Units</span>
                <Badge count={filteredUnits.length} showZero />
              </div>
            }
            extra={
              <Space>
                <Tooltip title="Refresh">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={loadUnits}
                    loading={unitsLoading}
                  />
                </Tooltip>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openUnitModal()}
                >
                  Add Unit
                </Button>
              </Space>
            }
          >
            {/* Search and Filter */}
            <div className="mb-4 space-y-2">
              <Search
                placeholder="Search units..."
                value={unitSearchText}
                onChange={(e) => setUnitSearchText(e.target.value)}
                allowClear
                className="w-full"
              />
              <div className="flex items-center justify-between">
                <Select
                  value={unitFilter}
                  onChange={setUnitFilter}
                  className="w-32"
                  suffixIcon={<FilterOutlined />}
                >
                  <Option value="all">All</Option>
                  <Option value="mine">Mine</Option>
                  {isAdmin && <Option value="others">Others</Option>}
                </Select>
                <Button
                  size="small"
                  icon={<ClearOutlined />}
                  onClick={clearUnitFilters}
                >
                  Clear
                </Button>
              </div>
            </div>

            <Table
              columns={unitColumns}
              dataSource={filteredUnits}
              rowKey="_id"
              loading={unitsLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} units`,
              }}
              locale={{
                emptyText: (
                  <Empty
                    description="No units found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
              }}
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Category Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <TagsOutlined />
            <span>{editingCategory ? 'Edit Category' : 'Add New Category'}</span>
          </div>
        }
        open={categoryModalVisible}
        onCancel={() => {
          setCategoryModalVisible(false);
          categoryForm.resetFields();
          setEditingCategory(null);
        }}
        footer={null}
        width={500}
      >
        <Form
          form={categoryForm}
          layout="vertical"
          onFinish={handleCategorySubmit}
          className="mt-4"
        >
          <Form.Item
            name="category_name"
            label="Category Name"
            rules={[
              { required: true, message: 'Please enter category name' },
              { min: 2, message: 'Category name must be at least 2 characters' },
              { max: 50, message: 'Category name cannot exceed 50 characters' },
            ]}
          >
            <Input
              placeholder="Enter category name"
              prefix={<TagsOutlined />}
            />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => setCategoryModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Unit Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <AppstoreOutlined />
            <span>{editingUnit ? 'Edit Unit' : 'Add New Unit'}</span>
          </div>
        }
        open={unitModalVisible}
        onCancel={() => {
          setUnitModalVisible(false);
          unitForm.resetFields();
          setEditingUnit(null);
        }}
        footer={null}
        width={500}
      >
        <Form
          form={unitForm}
          layout="vertical"
          onFinish={handleUnitSubmit}
          className="mt-4"
        >
          <Form.Item
            name="unit_name"
            label="Unit Name"
            rules={[
              { required: true, message: 'Please enter unit name' },
              { min: 1, message: 'Unit name must be at least 1 character' },
              { max: 20, message: 'Unit name cannot exceed 20 characters' },
            ]}
          >
            <Input
              placeholder="Enter unit name (e.g., kg, pcs, ltr)"
              prefix={<AppstoreOutlined />}
            />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => setUnitModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUnit ? 'Update' : 'Create'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Category View Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <TagsOutlined className="text-blue-500" />
            <span>Category Details</span>
          </div>
        }
        open={viewCategoryModalVisible}
        onCancel={() => setViewCategoryModalVisible(false)}
        footer={null}
        width={600}
      >
        {viewingCategory && (
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div className="flex justify-between items-center">
                    <Title level={4} className="mb-0">{viewingCategory.category_name}</Title>
                    <Tag color={viewingCategory.created_by === user?._id ? 'green' : 'blue'}>
                      {viewingCategory.created_by === user?._id ? 'Your Category' : 'Other User\'s Category'}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <Text strong>Created At:</Text>
                  <br />
                  <Text>{new Date(viewingCategory.createdAt).toLocaleString()}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Last Updated:</Text>
                  <br />
                  <Text>{new Date(viewingCategory.updatedAt).toLocaleString()}</Text>
                </Col>
              </Row>
            </div>
            
            <div className="flex justify-end space-x-2">
              {canEditCategory(viewingCategory) && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setViewCategoryModalVisible(false);
                    openCategoryModal(viewingCategory);
                  }}
                >
                  Edit Category
                </Button>
              )}
              <Button onClick={() => setViewCategoryModalVisible(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Unit View Modal */}
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <AppstoreOutlined className="text-green-500" />
            <span>Unit Details</span>
          </div>
        }
        open={viewUnitModalVisible}
        onCancel={() => setViewUnitModalVisible(false)}
        footer={null}
        width={600}
      >
        {viewingUnit && (
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div className="flex justify-between items-center">
                    <Title level={4} className="mb-0">{viewingUnit.unit_name}</Title>
                    <Tag color={viewingUnit.created_by === user?._id ? 'green' : 'blue'}>
                      {viewingUnit.created_by === user?._id ? 'Your Unit' : 'Other User\'s Unit'}
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <Text strong>Created At:</Text>
                  <br />
                  <Text>{new Date(viewingUnit.createdAt).toLocaleString()}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Last Updated:</Text>
                  <br />
                  <Text>{new Date(viewingUnit.updatedAt).toLocaleString()}</Text>
                </Col>
              </Row>
            </div>
            
            <div className="flex justify-end space-x-2">