import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, User, Trash2, Edit, Key, Store, X, Save } from 'lucide-react';
import { useCustomerAccounts, CustomerAccount } from '../hooks/useCustomerAccounts';

interface UserAccountManagerProps {
    onBack: () => void;
}

const UserAccountManager: React.FC<UserAccountManagerProps> = ({ onBack }) => {
    const { accounts, loading, addAccount, updateAccount, deleteAccount } = useCustomerAccounts();
    const [query, setQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<CustomerAccount | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        branch_name: ''
    });

    const filteredAccounts = accounts.filter(acc =>
        acc.username.toLowerCase().includes(query.toLowerCase()) ||
        acc.branch_name.toLowerCase().includes(query.toLowerCase())
    );

    const handleOpenModal = (account?: CustomerAccount) => {
        if (account) {
            setEditingAccount(account);
            setFormData({
                username: account.username,
                password: account.password || '',
                branch_name: account.branch_name
            });
        } else {
            setEditingAccount(null);
            setFormData({ username: '', password: '', branch_name: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAccount) {
                await updateAccount(editingAccount.id, formData);
            } else {
                await addAccount(formData);
            }
            setIsModalOpen(false);
        } catch (err) {
            alert('Failed to save account');
        }
    };

    const handleDelete = async (id: string, username: string) => {
        if (window.confirm(`Are you sure you want to delete the account for "${username}"?`)) {
            try {
                await deleteAccount(id);
            } catch (err) {
                alert('Failed to delete account');
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading accounts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Back</span>
                            </button>
                            <h1 className="text-2xl font-playfair font-semibold text-black">User Accounts</h1>
                        </div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add New User</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-200">
                    <div className="relative">
                        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by username or branch"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none"
                        />
                    </div>
                </div>

                {/* Accounts Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-4 text-left">Username</th>
                                    <th className="px-6 py-4 text-left">Branch Name</th>
                                    <th className="px-6 py-4 text-left">Password</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredAccounts.map((acc) => (
                                    <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                                    <User className="h-4 w-4 text-red-600" />
                                                </div>
                                                <span className="font-medium text-gray-900">{acc.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-gray-600">
                                                <Store className="h-4 w-4 mr-2 opacity-50" />
                                                {acc.branch_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-400">••••••••</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(acc)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(acc.id, acc.username)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredAccounts.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No accounts found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                {editingAccount ? 'Edit User Account' : 'Create Customer Account'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        required
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                        placeholder="Enter username"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        required
                                        type="text"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                        placeholder="Enter password"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        required
                                        value={formData.branch_name}
                                        onChange={e => setFormData({ ...formData, branch_name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                                        placeholder="Enter branch name"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>{editingAccount ? 'Update Account' : 'Create Account'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAccountManager;
