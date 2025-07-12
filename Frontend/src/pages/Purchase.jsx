import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  Card, 
  Tag, 
  Divider,
  Row,
  Col,
  InputNumber,
  Tooltip,
  Popconfirm,
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  EyeOutlined, 
  DeleteOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UndoOutlined
} from '@ant-design/icons';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  // Fetch all purchases
  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/purchases', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPurchases(data.data);
      } else {
        toast.error('Failed to fetch purchases');
      }
    } catch (error) {
      toast.error('Error fetching purchases');
    } finally {
      setLoading(false);
    }
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/v1/suppliers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuppliers(data.data);
      }
    } catch (error) {
      toast.error('Error fetching suppliers');
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/v1/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      toast.error('Error fetching products');
    }
  };

  // Fetch purchase details
  const fetchPurchaseDetails = async (purchaseId) => {
    try {
      const response = await fetch(`/api/v1/purchases/${purchaseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setPurchaseDetails(data.data);
      }
    } catch (error) {
      toast.error('Error fetching purchase details');
    }
  };

  // Create purchase
  const createPurchase = async (values) => {
    try {
      const response = await fetch('/api/v1/purchases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Purchase created successfully');
        fetchPurchases();
        setModalVisible(false);
        form.resetFields();
      } else {
        toast.error(data.message || 'Failed to create purchase');
      }
    } catch (error) {
      toast.error('Error creating purchase');
    }
  };

  // Update purchase status
  const updatePurchaseStatus = async (purchaseId, status) => {
    try {
      const response = await fetch(`/api/v1/purchases/${purchaseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ purchase_status: status })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Purchase status updated successfully');
        fetchPurchases();
      } else {
        toast.error(data.message || 'Failed to update purchase status');
      }
    } catch (error) {
      toast.error('Error updating purchase status');
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchSuppliers();
    fetchProducts();
  }, []);

  // Generate unique purchase number
  const generatePurchaseNo = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `P${year}${month}${day}${random}`;
  };

  // Handle form submission
  const handleSubmit = (values) => {
    const purchaseData = {
      supplier_id: values.supplier_id,
      purchase_no: values.purchase_no,
      purchase_status: values.purchase_status || 'pending',
      details: values.details.map(detail => ({
        product_id: detail.product_id,
        quantity: detail.quantity,
        unitcost: detail.unitcost
      }))
    };
    createPurchase(purchaseData);
  };

  // Get status tag color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'completed': return 'green';
      case 'returned': return 'red';
      default: return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockCircleOutlined />;
      case 'completed': return <CheckCircleOutlined />;
      case 'returned': return <UndoOutlined />;
      default: return null;
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Purchase No',
      dataIndex: 'purchase_no',
      key: 'purchase_no',
      filteredValue: [searchText],
      onFilter: (value, record) => 
        record.purchase_no.toLowerCase().includes(value.toLowerCase()) ||
        record.supplier_id?.name?.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Supplier',
      dataIndex: ['supplier_id', 'name'],
      key: 'supplier',
      render: (_, record) => record.supplier_id?.name || 'N/A',
    },
    {
      title: 'Purchase Date',
      dataIndex: 'purchase_date',
      key: 'purchase_date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'purchase_status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Created By',
      dataIndex: ['created_by', 'username'],
      key: 'created_by',
      render: (_, record) => record.created_by?.username || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button 
              icon={<EyeOutlined />} 
              size="small" 
              onClick={() => {
                setSelectedPurchase(record);
                fetchPurchaseDetails(record._id);
                setDetailModalVisible(true);
              }}
            />
          </Tooltip>
          
          {record.purchase_status === 'pending' && (
            <Tooltip title="Mark as Completed">
              <Popconfirm
                title="Mark this purchase as completed?"
                onConfirm={() => updatePurchaseStatus(record._id, 'completed')}
              >
                <Button 
                  icon={<CheckCircleOutlined />} 
                  size="small" 
                  type="primary"
                />
              </Popconfirm>
            </Tooltip>
          )}
          
          {record.purchase_status === 'completed' && (
            <Tooltip title="Mark as Returned">
              <Popconfirm
                title="Mark this purchase as returned?"
                onConfirm={() => updatePurchaseStatus(record._id, 'returned')}
              >
                <Button 
                  icon={<UndoOutlined />} 
                  size="small" 
                  danger
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Detail modal columns
  const detailColumns = [
    {
      title: 'Product',
      dataIndex: ['product_id', 'product_name'],
      key: 'product_name',
      render: (_, record) => record.product_id?.product_name || 'N/A',
    },
    {
      title: 'Product Code',
      dataIndex: ['product_id', 'product_code'],
      key: 'product_code',
      render: (_, record) => record.product_id?.product_code || 'N/A',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unitcost',
      key: 'unitcost',
      render: (cost) => `₹${cost.toFixed(2)}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `₹${total.to