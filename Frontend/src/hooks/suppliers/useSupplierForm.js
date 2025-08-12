import { useState } from "react";
import { Form } from "antd";
import { toast } from "react-hot-toast";

export const useSupplierForm = (onSuccess) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();

    const openCreateModal = () => {
        setEditMode(false);
        setSelectedSupplier(null);
        form.resetFields();
        setFileList([]);
        setModalVisible(true);
    };

    const openEditModal = (supplier) => {
        setSelectedSupplier(supplier);
        setEditMode(true);
        form.setFieldsValue({
            name: supplier.name,
            email: supplier.email,
            phone: supplier.phone,
            address: supplier.address,
            shopname: supplier.shopname,
            type: supplier.type,
            bank_name: supplier.bank_name,
            account_holder: supplier.account_holder,
            account_number: supplier.account_number,
        });
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        form.resetFields();
        setFileList([]);
        setEditMode(false);
        setSelectedSupplier(null);
    };

    const handleSubmit = async (values, createFn, updateFn) => {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
            if (values[key] !== undefined && values[key] !== null) {
                formData.append(key, values[key]);
            }
        });

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append("photo", fileList[0].originFileObj);
        }

        let success;
        if (editMode && selectedSupplier) {
            success = await updateFn(selectedSupplier._id, formData);
        } else {
            success = await createFn(formData);
        }

        if (success) {
            closeModal();
            onSuccess?.();
        }
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
                toast.error("You can only upload image files!");
                return false;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                toast.error("Image must be smaller than 2MB!");
                return false;
            }
            return false;
        },
        fileList,
        onChange: ({ fileList }) => setFileList(fileList),
    };

    return {
        modalVisible,
        editMode,
        selectedSupplier,
        form,
        fileList,
        uploadProps,
        openCreateModal,
        openEditModal,
        closeModal,
        handleSubmit,
    };
};
