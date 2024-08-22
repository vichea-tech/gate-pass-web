import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm } from 'antd';

interface User {
    id: number;
    name: string;
    email: string;
    role?: {
        name: string;
    };
}

interface CardProps {
    user: User;
    onEdit: () => void;
    onDelete: () => void;
}

const UserCard: React.FC<CardProps> = ({ user, onEdit, onDelete }) => {
    const confirmDelete = () => {
        onDelete();
        // message.success('User deleted successfully');
    };

    const cancelDelete = () => {
        // message.error('Delete operation cancelled');
    };

    return (
        <div className="flex py-[20px] shadow-10">
            <p className="w-[30%]">{user.name}</p>
            <p className="w-[40%]">{user.email}</p>
            <p className="w-[20%]">{user.role ? user.role.name : 'Undefined Role'}</p>
            <div className="flex gap-5">
                <EditOutlined className="text-blue-700" onClick={onEdit} />

                <Popconfirm
                    title="Delete the user"
                    description="Are you sure you want to delete this user?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    okText="Yes"
                    cancelText="No"
                >
                    <DeleteOutlined className="text-red" />
                </Popconfirm>
            </div>
        </div>
    );
}

export default UserCard;
