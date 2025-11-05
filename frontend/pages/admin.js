import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import PromoCodeManager from '@/components/PromoCodeManager';
import axios from 'axios';
import { FiUsers, FiDollarSign, FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function Admin() {
  const { user, loading, token } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [courseInfo, setCourseInfo] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [message, setMessage] = useState('');
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [syllabusPdfUrl, setSyllabusPdfUrl] = useState('');
  const [statsForm, setStatsForm] = useState({
    studentsEnrolled: '',
    referralRate: '',
    averagePackage: '',
    hiringPartners: ''
  });

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && user.isAdmin && token) {
      fetchUsers();
      fetchCourseInfo();
      fetchPayments();
      fetchStats();
    }
  }, [user, token]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCourseInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/course');
      setCourseInfo(response.data);
      setNewPrice(response.data.price);
      setNewOriginalPrice(response.data.originalPrice || '');
      setNewStartDate(new Date(response.data.startDate).toISOString().split('T')[0]);
      setSyllabusPdfUrl(response.data.syllabusPdfUrl || '');
      if (response.data.stats) {
        setStatsForm({
          studentsEnrolled: response.data.stats.studentsEnrolled || '',
          referralRate: response.data.stats.referralRate || '',
          averagePackage: response.data.stats.averagePackage || '',
          hiringPartners: response.data.stats.hiringPartners || ''
        });
      }
    } catch (error) {
      console.error('Error fetching course info:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/payments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const toggleEnrollment = async (userId, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/enroll`,
        { isEnrolled: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      setMessage('User enrollment status updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating enrollment:', error);
      setMessage('Error updating enrollment');
    }
  };

  const updatePrice = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:5000/api/course/price',
        { 
          price: parseInt(newPrice),
          originalPrice: newOriginalPrice ? parseInt(newOriginalPrice) : null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourseInfo();
      setMessage('Course price updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating price:', error);
      setMessage('Error updating price');
    }
  };

  const updateStartDate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:5000/api/course/start-date',
        { startDate: newStartDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourseInfo();
      setMessage('Course start date updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating start date:', error);
      setMessage('Error updating start date');
    }
  };

  const updateSyllabusPdf = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:5000/api/course/syllabus',
        { syllabusPdfUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourseInfo();
      setMessage('Syllabus PDF URL updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating syllabus PDF:', error);
      setMessage('Error updating syllabus PDF');
    }
  };

  const updateStats = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:5000/api/course/stats',
        {
          studentsEnrolled: parseInt(statsForm.studentsEnrolled),
          referralRate: parseInt(statsForm.referralRate),
          averagePackage: parseInt(statsForm.averagePackage),
          hiringPartners: parseInt(statsForm.hiringPartners)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourseInfo();
      setMessage('Course stats updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating stats:', error);
      setMessage('Error updating stats');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setMessage('User deleted successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Error deleting user');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

          {message && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-sm text-gray-600 mb-1">Total Users</div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-sm text-gray-600 mb-1">Enrolled Users</div>
                <div className="text-3xl font-bold text-green-600">{stats.enrolledUsers}</div>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-sm text-gray-600 mb-1">Successful Payments</div>
                <div className="text-3xl font-bold text-blue-600">{stats.successfulPayments}</div>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                <div className="text-3xl font-bold text-primary">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Users Management
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payments'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Payment History
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Course Settings
              </button>
              <button
                onClick={() => setActiveTab('promocodes')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'promocodes'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Promo Codes
              </button>
            </nav>
          </div>

          {/* Course Settings */}
          {activeTab === 'settings' && (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiDollarSign className="text-2xl text-primary" />
                <h2 className="text-xl font-bold">Course Price</h2>
              </div>
              <form onSubmit={updatePrice}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (₹) <span className="text-gray-500 text-xs">(Optional - for strikethrough)</span>
                  </label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Leave empty for no strikethrough"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Update Price
                </button>
              </form>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiCalendar className="text-2xl text-primary" />
                <h2 className="text-xl font-bold">Course Start Date</h2>
              </div>
              <form onSubmit={updateStartDate}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Update Start Date
                </button>
              </form>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl font-bold">Syllabus PDF</h2>
              </div>
              <form onSubmit={updateSyllabusPdf}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Syllabus PDF URL
                  </label>
                  <input
                    type="url"
                    value={syllabusPdfUrl}
                    onChange={(e) => setSyllabusPdfUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="https://example.com/syllabus.pdf"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload the PDF to Google Drive or any hosting service and paste the public link here
                  </p>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Update Syllabus PDF
                </button>
              </form>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <FiUsers className="text-2xl text-primary" />
                <h2 className="text-xl font-bold">Course Statistics</h2>
              </div>
              <form onSubmit={updateStats}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Students Enrolled
                    </label>
                    <input
                      type="number"
                      value={statsForm.studentsEnrolled}
                      onChange={(e) => setStatsForm({...statsForm, studentsEnrolled: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Rate (%)
                    </label>
                    <input
                      type="number"
                      value={statsForm.referralRate}
                      onChange={(e) => setStatsForm({...statsForm, referralRate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avg Package (LPA)
                    </label>
                    <input
                      type="number"
                      value={statsForm.averagePackage}
                      onChange={(e) => setStatsForm({...statsForm, averagePackage: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hiring Partners
                    </label>
                    <input
                      type="number"
                      value={statsForm.hiringPartners}
                      onChange={(e) => setStatsForm({...statsForm, hiringPartners: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Update Statistics
                </button>
              </form>
            </div>
          </div>
          </>
          )}

          {/* Users List */}
          {activeTab === 'users' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <FiUsers className="text-2xl text-primary" />
              <h2 className="text-xl font-bold">Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{u.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{u.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {u.isEnrolled ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Enrolled
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Not Enrolled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => toggleEnrollment(u._id, u.isEnrolled)}
                          className={`${
                            u.isEnrolled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                          } text-white px-3 py-1 rounded`}
                        >
                          {u.isEnrolled ? 'Unenroll' : 'Enroll'}
                        </button>
                        {!u.isAdmin && (
                          <button
                            onClick={() => deleteUser(u._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Payment History */}
          {activeTab === 'payments' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Payment History ({payments.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900">
                          {payment.orderId.substring(0, 20)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.userId?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.userId?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ₹{payment.orderAmount.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.paymentStatus === 'SUCCESS'
                            ? 'bg-green-100 text-green-800'
                            : payment.paymentStatus === 'FAILED'
                            ? 'bg-red-100 text-red-800'
                            : payment.paymentStatus === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {payment.paymentMethod || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleTimeString('en-IN')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Promo Codes Tab */}
          {activeTab === 'promocodes' && (
            <PromoCodeManager token={token} />
          )}
        </div>
      </div>
    </Layout>
  );
}

