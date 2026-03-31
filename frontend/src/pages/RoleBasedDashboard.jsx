import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RoleBasedDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Role-based dashboard content
  const renderDashboard = () => {
    switch (user.role) {
      case "user":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-slate-900 mb-6">Job Seeker Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">My Profile</h2>
                <p className="text-slate-600">Manage your profile and resume</p>
                <button
                  onClick={() => handleNavigation("/profile")}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Edit Profile
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">Job Search</h2>
                <p className="text-slate-600">Find and apply for jobs</p>
                <button
                  onClick={() => handleNavigation("/jobs")}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Search Jobs
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">My Applications</h2>
                <p className="text-slate-600">Track your job applications</p>
                <button
                  onClick={() => handleNavigation("/applications")}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  View Applications
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">Messages</h2>
                <p className="text-slate-600">Communicate with recruiters and teams</p>
                <button
                  onClick={() => handleNavigation("/messages")}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  View Messages
                </button>
              </div>
            </div>
          </div>
        );

      case "recruiter":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-slate-900 mb-6">Recruiter Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">Company Management</h2>
                <p className="text-slate-600">Manage your company page</p>
                <button
                  onClick={() => handleNavigation("/company")}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Manage Company
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">Job Postings</h2>
                <p className="text-slate-600">Post and manage job listings</p>
                <button
                  onClick={() => handleNavigation("/jobs")}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Manage Jobs
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">Applicants</h2>
                <p className="text-slate-600">Review job applications</p>
                <button
                  onClick={() => handleNavigation("/applications")}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  View Applicants
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">Messages</h2>
                <p className="text-slate-600">Communicate with candidates and team</p>
                <button
                  onClick={() => handleNavigation("/messages")}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  View Messages
                </button>
              </div>
            </div>
          </div>
        );

      case "admin":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-slate-900 mb-6">Platform Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">User Management</h2>
                <p className="text-slate-600">Manage platform users</p>
                <button
                  onClick={() => handleNavigation("/admin/users")}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Manage Users
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">System Monitoring</h2>
                <p className="text-slate-600">View system status and logs</p>
                <button
                  onClick={() => handleNavigation("/admin/system")}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  System Logs
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-slate-900 mb-4">Audit Logs</h2>
                <p className="text-slate-600">View tamper-evident audit logs</p>
                <button
                  onClick={() => handleNavigation("/admin/audit")}
                  className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  View Audit Logs
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h2 className="text-lg font-medium text-red-800 mb-2">Unknown Role</h2>
              <p className="text-red-600">Your user role ({user.role}) is not recognized.</p>
              <p className="text-red-600">Please contact support for assistance.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-slate-900">Secure Job Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Welcome, {user.first_name} {user.last_name}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                {user.role === "user" ? "Job Seeker" :
                  user.role === "recruiter" ? "Recruiter" : "Admin"}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {renderDashboard()}
      </main>
    </div>
  );
}

export default RoleBasedDashboard;
