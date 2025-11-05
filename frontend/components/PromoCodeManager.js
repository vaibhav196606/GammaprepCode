import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiTag, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight, FiPlus } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PromoCodeManager({ token }) {
  const [promoCodes, setPromoCodes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    description: '',
    maxUses: '',
    validUntil: ''
  });

  useEffect(() => {
    fetchPromoCodes();
  }, [token]);

  const fetchPromoCodes = async () => {
    try {
      const response = await axios.get('${API_URL}/api/promo/admin', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPromoCodes(response.data);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountPercent: '',
      description: '',
      maxUses: '',
      validUntil: ''
    });
    setEditingCode(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (editingCode) {
        // Update existing promo code
        await axios.put(
          `${API_URL}/api/promo/admin/${editingCode._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('Promo code updated successfully');
      } else {
        // Create new promo code
        await axios.post(
          '${API_URL}/api/promo/admin',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessage('Promo code created successfully');
      }

      fetchPromoCodes();
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving promo code');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (promoCode) => {
    setEditingCode(promoCode);
    setFormData({
      code: promoCode.code,
      discountPercent: promoCode.discountPercent,
      description: promoCode.description || '',
      maxUses: promoCode.maxUses || '',
      validUntil: promoCode.validUntil ? new Date(promoCode.validUntil).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleToggle = async (promoCode) => {
    try {
      await axios.put(
        `${API_URL}/api/promo/admin/${promoCode._id}`,
        { isActive: !promoCode.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPromoCodes();
      setMessage(`Promo code ${!promoCode.isActive ? 'activated' : 'deactivated'}`);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error toggling promo code:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;

    try {
      await axios.delete(`${API_URL}/api/promo/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPromoCodes();
      setMessage('Promo code deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting promo code:', error);
      setMessage('Error deleting promo code');
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <div className={`px-4 py-3 rounded ${
          message.includes('Error') || message.includes('deactivated')
            ? 'bg-red-100 border border-red-400 text-red-700'
            : 'bg-green-100 border border-green-400 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Add/Edit Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FiTag className="text-primary" />
            {editingCode ? 'Edit Promo Code' : 'Create New Promo Code'}
          </h2>
          <button
            onClick={() => showForm ? resetForm() : setShowForm(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : <><FiPlus /> Add Promo Code</>}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary uppercase"
                  placeholder="e.g., SAVE20"
                  required
                  disabled={!!editingCode}
                />
                {editingCode && (
                  <p className="text-xs text-gray-500 mt-1">Code cannot be changed after creation</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Percentage * (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g., 20"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g., Early bird discount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Uses (Leave empty for unlimited)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUses}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g., 100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until (Leave empty for no expiry)
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingCode ? 'Update Promo Code' : 'Create Promo Code')}
              </button>
              {editingCode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Promo Codes List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">All Promo Codes</h2>
        
        {promoCodes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No promo codes yet. Create your first one!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promoCodes.map((code) => (
                  <tr key={code._id} className={!code.isActive ? 'bg-gray-50 opacity-60' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-primary">{code.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-600 font-semibold">{code.discountPercent}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{code.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {code.usedCount} {code.maxUses ? `/ ${code.maxUses}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        code.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {code.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {code.validUntil ? new Date(code.validUntil).toLocaleDateString() : 'No expiry'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleToggle(code)}
                          className="text-blue-600 hover:text-blue-900"
                          title={code.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {code.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                        </button>
                        <button
                          onClick={() => handleEdit(code)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(code._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



