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
  Divider
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  MoreOutlined,
  SearchOutlined,
  ReloadOutlined,
  TagsOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { api } from '../api/api';
import { useAuth } from '../hooks/useAuth';

const { Title } = Typography;
const { Search } = Input;

const CategoryUnit = () => {
  const { user, isAdmin } = useAuth();
  
  // Categories State
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm] = Form.useForm();
  const [categorySearchText, setCategorySearchText] = useState('');
  
  // Units State
  const [units, setUnits] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [unitForm] = Form.useForm();
  const [unitSearchText, setUnitSearchText] = useState('');

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
      }
    } catch (error) {
      message.error('Failed to load categories');
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
      }
    } catch (error) {
      message.error('Failed to load units');
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
    try {
      if (editingCategory) {
        // Update category
        const endpoint = isAdmin ? 
          `/categories/admin/${editingCategory._id}` : 
          `/categories/user/${editingCategory._id}`;
        
        const response = await api.patch(endpoint, values);
        if (response.data.success) {
          message.success('Category updated successfully');
          loadCategories();
        }
      } else {
        // Create category
        const response = await api.post('/categories', values);
        if (response.data.success) {
          message.success('Category created successfully');
          loadCategories();
        }
      }
      
      setCategoryModalVisible(false);
      categoryForm.resetFields();
      setEditingCategory(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Operation failed';
      message.error(errorMsg);
    }
  };

  const handleUnitSubmit = async (values) => {
    try {
      if (editingUnit) {
        // Update unit
        const response = await api.patch(`/units/${editingUnit._id}`, values);
        if (response.data.success) {
          message.success('Unit updated successfully');
          loadUnits();
        }
      } else {
        // Create unit
        const response = await api.post('/units', values);
        if (response.data.success) {
          message.success('Unit created successfully');
          loadUnits();
        }
      }
      
      setUnitModalVisible(false);
      unitForm.resetFields();
      setEditingUnit(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Operation failed';
      message.error(errorMsg);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const endpoint = isAdmin ? 
        `/categories/admin/${categoryId}` : 
        `/categories/user/${categoryId}`;
      
      const response = await api.delete(endpoint);
      if (response.data.success) {
        message.success('Category deleted successfully');
        loadCategories();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete category';
      message.error(errorMsg);
    }
  };

  const deleteUnit = async (unitId) => {
    try {
      const response = await api.delete(`/units/${unitId}`);
      if (response.data.success) {
        message.success('Unit deleted successfully');
        loadUnits();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete unit';
      message.error(errorMsg);
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

  // Filter functions
  const filteredCategories = categories.filter(category =>
    category.category_name.toLowerCase().includes(categorySearchText.toLowerCase())
  );

  const filteredUnits = units.filter(unit =>
    unit.unit_name.toLowerCase().includes(unitSearchText.toLowerCase())
  );

  // Check permissions
  const canEditCategory = (category) => {
    return isAdmin || category.created_by === user?._id;
  };

  const canEditUnit = (unit) => {
    return isAdmin || unit.created_by === user?._id;
  };

  // Table columns
  const categoryColumns = [
    {
      title: 'Name',
      dataIndex: 'category_name',
      key: 'category_name',
      sorter: (a, b) => a.category_name.localeCompare(b.category_name),
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      render: (createdBy) => (
        <Tag color={createdBy === user?._id ? 'green' : 'blue'}>
          {createdBy === user?._id ? 'You' : 'Other User'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
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
            <Popconfirm
              title="Delete Category"
              description="Are you sure you want to delete this category?"
              onConfirm={() => deleteCategory(record._id)}
              disabled={!canEditCategory(record)}
            >
              <Button 
                danger 
                size="small" 
                icon={<DeleteOutlined />}
                disabled={!canEditCategory(record)}
              >
                Delete
              </Button>
            </Popconfirm>
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
    },
    {
      title: 'Created By',
      dataIndex: 'created_by',
      key: 'created_by',
      render: (createdBy) => (
        <Tag color={createdBy === user?._id ? 'green' : 'blue'}>
          {createdBy === user?._id ? 'You' : 'Other User'}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
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
          <Popconfirm
            title="Delete Unit"
            description="Are you sure you want to delete this unit?"
            onConfirm={() => deleteUnit(record._id)}
            disabled={!canEditUnit(record)}
          >
            <Button 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
              disabled={!canEditUnit(record)}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">