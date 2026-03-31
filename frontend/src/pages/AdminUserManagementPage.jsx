import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
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

    // Mock user data
    setUsers([
      {
        id: 1,
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "user",
        isVerified: true,
        isActive: true,
        registrationDate: "2024-03-15",
        lastLogin: "2024-03-20"
      },
      {
        id: 2,
        email: "jane.smith@company.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "recruiter",
        companyName: "Tech Solutions Inc",
        isVerified: true,
        isActive: true,
        registrationDate: "2024-03-10",
        lastLogin: "2024-03-19"
      },
      {
        id: 3,
        email: "mike.johnson@company.com",
        firstName: "Mike",
        lastName: "Johnson",
        role: "recruiter",
        companyName: "Digital Agency",
        isVerified: false,
        isActive: true,
        registrationDate: "2024-03-12",
        lastLogin: "2024-03-18"
      },
      {
        id: 4,
        email: "sarah.wilson@example.com",
        firstName: "Sarah",
        lastName: "Wilson",
        role: "user",
        isVerified: true,
        isActive: false,
        registrationDate: "2024-03-08",
        lastLogin: "2024-03-15"
      }
    ]);
    
    setLoading(false);
  }, [navigate]);

  const handleToggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    ));
  };

  const handleToggleVerification = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isVerified: !user.isVerified }
        : user
    ));
  };

  const handleDeleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === "all" || user.role === filter;
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800";
      case "recruiter": return "bg-blue-100 text-blue-800";
      case "user": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading users...</p>
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
              <h1 className="text-xl font-semibold text-slate-900">User Management</h1>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Filter by Role</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="recruiter">Recruiters</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm w-64"
                />
              </div>
            </div>
            <div className="text-sm text-slate-600">
              {filteredUsers.length} users found
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                        {user.companyName && (
                          <div className="text-xs text-slate-400">{user.companyName}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.isVerified 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {user.isVerified ? "Verified" : "Pending"}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {user.registrationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleVerification(user.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {user.isVerified ? "Unverify" : "Verify"}
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="text-slate-600 hover:text-slate-900"
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminUserManagementPage;
