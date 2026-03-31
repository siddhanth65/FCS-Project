import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminAuditPage() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    // Mock audit log data
    setAuditLogs([
      {
        id: 1,
        timestamp: "2024-03-20T14:30:22Z",
        userId: 123,
        userEmail: "john.doe@example.com",
        action: "LOGIN",
        resource: "/auth/login",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        status: "SUCCESS",
        details: "User logged in successfully"
      },
      {
        id: 2,
        timestamp: "2024-03-20T14:25:15Z",
        userId: 456,
        userEmail: "jane.smith@company.com",
        action: "PROFILE_UPDATE",
        resource: "/api/profile/me",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        status: "SUCCESS",
        details: "Updated profile information: headline, location"
      },
      {
        id: 3,
        timestamp: "2024-03-20T14:20:08Z",
        userId: 789,
        userEmail: "mike.johnson@company.com",
        action: "JOB_CREATE",
        resource: "/api/jobs",
        ipAddress: "192.168.1.102",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        status: "SUCCESS",
        details: "Created new job posting: Senior Software Engineer"
      },
      {
        id: 4,
        timestamp: "2024-03-20T14:15:33Z",
        userId: 101,
        userEmail: "sarah.wilson@example.com",
        action: "LOGIN_FAILED",
        resource: "/auth/login",
        ipAddress: "192.168.1.103",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15",
        status: "FAILED",
        details: "Invalid password attempt"
      },
      {
        id: 5,
        timestamp: "2024-03-20T14:10:45Z",
        userId: 112,
        userEmail: "admin@system.com",
        action: "USER_DELETE",
        resource: "/api/admin/users/999",
        ipAddress: "192.168.1.104",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        status: "SUCCESS",
        details: "Admin deleted user account: spam@example.com"
      },
      {
        id: 6,
        timestamp: "2024-03-20T14:05:12Z",
        userId: 133,
        userEmail: "tom.brown@company.com",
        action: "MESSAGE_SEND",
        resource: "/api/messages",
        ipAddress: "192.168.1.105",
        userAgent: "Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0",
        status: "SUCCESS",
        details: "Sent message to user ID 456"
      }
    ]);
    
    setLoading(false);
  }, [navigate]);

  const getActionColor = (action) => {
    switch (action) {
      case "LOGIN": return "bg-green-100 text-green-800";
      case "LOGIN_FAILED": return "bg-red-100 text-red-800";
      case "PROFILE_UPDATE": return "bg-blue-100 text-blue-800";
      case "JOB_CREATE": return "bg-purple-100 text-purple-800";
      case "USER_DELETE": return "bg-red-100 text-red-800";
      case "MESSAGE_SEND": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    return status === "SUCCESS" 
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesFilter = filter === "all" || log.action === filter;
    const matchesSearch = log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-slate-900">Audit Logs</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-slate-600 hover:text-slate-900"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Action</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Actions</option>
                  <option value="LOGIN">Login</option>
                  <option value="LOGIN_FAILED">Failed Login</option>
                  <option value="PROFILE_UPDATE">Profile Update</option>
                  <option value="JOB_CREATE">Job Create</option>
                  <option value="USER_DELETE">User Delete</option>
                  <option value="MESSAGE_SEND">Message Send</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search logs..."
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm w-64"
                />
              </div>
            </div>
            <div className="text-sm text-slate-600">
              {filteredLogs.length} logs found
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {log.userEmail}
                        </div>
                        <div className="text-xs text-slate-500">ID: {log.userId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionColor(log.action)}`}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {log.ipAddress}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="max-w-xs truncate" title={log.details}>
                        {log.details}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No audit logs found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-6 bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-slate-900">Export Options</h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">
                Export to CSV
              </button>
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50">
                Export to JSON
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminAuditPage;
