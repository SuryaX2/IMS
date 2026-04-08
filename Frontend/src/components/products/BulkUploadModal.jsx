import React, { useState } from "react";
import {
    Modal,
    Upload,
    Button,
    Table,
    Typography,
    Alert,
    Progress,
    Tag,
    Divider,
    message,
} from "antd";
import {
    UploadOutlined,
    DownloadOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { api } from "../../api/api";

const { Text } = Typography;

const BulkUploadModal = ({
    visible,
    categories,
    units,
    onClose,
    onComplete,
}) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileSelect = (selectedFile) => {
        const isCSV =
            selectedFile.type === "text/csv" ||
            selectedFile.type === "application/vnd.ms-excel" ||
            selectedFile.name.toLowerCase().endsWith(".csv");

        if (!isCSV) {
            message.error("Only CSV files are accepted (.csv)");
            setFile(null);
            return false;
        }

        setFile(selectedFile);
        setResult(null);
        return false;
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        setProgress(0);

        try {
            const response = await api.post("/products/bulk-upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const pct = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(pct);
                },
            });

            setResult(response.data.data);

            if (response.data.data?.inserted > 0) {
                onComplete();
            }
        } catch (err) {
            const data = err.response?.data;
            if (data?.data) {
                setResult(data.data);
            } else {
                setResult({
                    total: 0,
                    inserted: 0,
                    failed: 1,
                    errors: [
                        {
                            row: "-",
                            product_code: "-",
                            errors: [data?.message || "Upload failed"],
                        },
                    ],
                });
            }
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setResult(null);
        setProgress(0);
        onClose();
    };

    const handleDownloadTemplate = () => {
        const exampleCategory = categories[0]?.category_name || "Electronics";
        const exampleUnit = units[0]?.unit_name || "Piece";

        const csvContent = [
            "product_name,product_code,category_name,unit_name,buying_price,selling_price",
            `"Example Product",EX001,"${exampleCategory}","${exampleUnit}",100.00,150.00`,
        ].join("\n");

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "products_template.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const errorColumns = [
        {
            title: "Row",
            dataIndex: "row",
            width: 70,
            render: (val) => <Text type="secondary">#{val}</Text>,
        },
        {
            title: "Product Code",
            dataIndex: "product_code",
            width: 120,
            render: (val) => <Text code>{val}</Text>,
        },
        {
            title: "Errors",
            dataIndex: "errors",
            render: (errs) => (
                <div className="flex flex-col gap-1">
                    {errs.map((e, i) => (
                        <Text key={i} type="danger" className="text-xs">
                            • {e}
                        </Text>
                    ))}
                </div>
            ),
        },
    ];

    const hasResult = result !== null;
    const allSucceeded = hasResult && result.failed === 0;
    const partialSuccess =
        hasResult && result.inserted > 0 && result.failed > 0;
    const allFailed = hasResult && result.inserted === 0;

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-600" />
                    <span className="text-lg font-bold">
                        Bulk Product Upload
                    </span>
                </div>
            }
            open={visible}
            onCancel={handleClose}
            width={720}
            footer={null}
            destroyOnClose
        >
            <div className="space-y-4 py-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <Text className="font-semibold text-blue-900 block mb-1">
                                Step 1: Download Template
                            </Text>
                            <Text className="text-sm text-blue-700">
                                Use the template CSV to ensure correct column
                                names. Required:{" "}
                                <Text code className="text-xs">
                                    product_name
                                </Text>
                                ,{" "}
                                <Text code className="text-xs">
                                    product_code
                                </Text>
                                ,{" "}
                                <Text code className="text-xs">
                                    category_name
                                </Text>
                                ,{" "}
                                <Text code className="text-xs">
                                    unit_name
                                </Text>
                                ,{" "}
                                <Text code className="text-xs">
                                    buying_price
                                </Text>
                                ,{" "}
                                <Text code className="text-xs">
                                    selling_price
                                </Text>
                            </Text>
                        </div>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleDownloadTemplate}
                            size="small"
                            className="flex-shrink-0"
                        >
                            Template
                        </Button>
                    </div>
                </div>

                <div>
                    <Text className="font-semibold block mb-2">
                        Step 2: Select CSV File
                    </Text>
                    <Upload
                        accept=".csv"
                        beforeUpload={handleFileSelect}
                        maxCount={1}
                        showUploadList={false}
                        onRemove={() => setFile(null)}
                    >
                        <Button
                            icon={<UploadOutlined />}
                            size="large"
                            className="w-full"
                        >
                            {file
                                ? `Selected: ${file.name}`
                                : "Click to select CSV file"}
                        </Button>
                    </Upload>
                    {file && (
                        <Text type="secondary" className="text-xs mt-1 block">
                            {(file.size / 1024).toFixed(1)} KB — up to 500 rows
                            supported
                        </Text>
                    )}
                </div>

                {uploading && (
                    <Progress
                        percent={progress}
                        status="active"
                        strokeColor={{ from: "#108ee9", to: "#87d068" }}
                    />
                )}

                {!hasResult && (
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleUpload}
                        loading={uploading}
                        disabled={!file || uploading}
                        className="w-full"
                    >
                        {uploading ? "Uploading…" : "Upload Products"}
                    </Button>
                )}

                {hasResult && (
                    <div className="space-y-3">
                        <Divider className="!my-2" />

                        {allSucceeded && (
                            <Alert
                                type="success"
                                icon={<CheckCircleOutlined />}
                                message={`All ${result.inserted} product(s) uploaded successfully!`}
                                showIcon
                            />
                        )}

                        {partialSuccess && (
                            <Alert
                                type="warning"
                                message={`Partial success: ${result.inserted} inserted, ${result.failed} failed.`}
                                showIcon
                            />
                        )}

                        {allFailed && (
                            <Alert
                                type="error"
                                icon={<CloseCircleOutlined />}
                                message={`Upload failed. ${result.failed} row(s) had errors.`}
                                showIcon
                            />
                        )}

                        <div className="flex gap-2 flex-wrap">
                            <Tag color="default">
                                Total rows: {result.total}
                            </Tag>
                            {result.inserted > 0 && (
                                <Tag color="success">
                                    ✓ Inserted: {result.inserted}
                                </Tag>
                            )}
                            {result.failed > 0 && (
                                <Tag color="error">
                                    ✗ Failed: {result.failed}
                                </Tag>
                            )}
                        </div>

                        {result.errors?.length > 0 && (
                            <div>
                                <Text className="font-semibold text-red-600 block mb-2">
                                    Row Errors ({result.errors.length})
                                </Text>
                                <Table
                                    dataSource={result.errors.map((e, i) => ({
                                        ...e,
                                        key: i,
                                    }))}
                                    columns={errorColumns}
                                    size="small"
                                    pagination={
                                        result.errors.length > 10
                                            ? { pageSize: 10, size: "small" }
                                            : false
                                    }
                                    scroll={{ x: 400 }}
                                    className="border rounded-lg overflow-hidden"
                                />
                            </div>
                        )}

                        <div className="flex gap-2 pt-2">
                            <Button
                                onClick={() => {
                                    setFile(null);
                                    setResult(null);
                                    setProgress(0);
                                }}
                                className="flex-1"
                            >
                                Upload Another File
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleClose}
                                className="flex-1"
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default BulkUploadModal;
