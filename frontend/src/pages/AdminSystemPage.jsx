import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminSystemPage() {
  const [systemStats, setSystemStats] = useState(null);
  const [loading, setLoading] = useState(true);
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

    // Mock system data
    setSystemStats({
      users: {
        total: 1234,
        active: 1156,
        newThisMonth: 89,
        byRole: {
          user: 890,
          recruiter: 234,
          admin: 12
        }
      },
      jobs: {
        total: 456,
        active: 312,
        closed: 144,
        newThisMonth: 67
      },
      applications: {
        total: 5678,
        thisMonth: 892,
        pending: 234,
        reviewed: 456,
        interviewed: 123,
        offered: 45,
        rejected: 78
      },
      messages: {
        total: 12345,
        today: 234,
        thisWeek: 1456
      },
      system: {
        uptime: "99.9%",
        version: "1.0.0",
        lastUpdate: "2024-03-20",
        databaseSize: "2.3 GB",
        storageUsed: "15.6 GB"
      }
    });
    
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading system data...</p>
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
              <h1 className="text-xl font-semibold text-slate-900">System Monitoring</h1>
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
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 font-bold">U</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-slate-900">Total Users</h3>
                <p className="text-2xl font-bold text-indigo-600">{systemStats.users.total.toLocaleString()}</p>
                <p className="text-sm text-slate-500">+{systemStats.users.newThisMonth} this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">J</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-slate-900">Active Jobs</h3>
                <p className="text-2xl font-bold text-green-600">{systemStats.jobs.active}</p>
                <p className="text-sm text-slate-500">of {systemStats.jobs.total} total</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">A</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-slate-900">Applications</h3>
                <p className="text-2xl font-bold text-purple-600">{systemStats.applications.thisMonth}</p>
                <p className="text-sm text-slate-500">this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">M</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-slate-900">Messages Today</h3>
                <p className="text-2xl font-bold text-blue-600">{systemStats.messages.today}</p>
                <p className="text-sm text-slate-500">+{systemStats.messages.thisWeek} this week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Statistics */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-medium text-slate-900">User Statistics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Total Users</span>
                  <span className="text-sm text-slate-900">{systemStats.users.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Active Users</span>
                  <span className="text-sm text-slate-900">{systemStats.users.active.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">New This Month</span>
                  <span className="text-sm text-slate-900">{systemStats.users.newThisMonth}</span>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Users by Role</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Job Seekers</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{width: `${(systemStats.users.byRole.user / systemStats.users.total) * 100}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-900">{systemStats.users.byRole.user}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Recruiters</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{width: `${(systemStats.users.byRole.recruiter / systemStats.users.total) * 100}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-900">{systemStats.users.byRole.recruiter}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Admins</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{width: `${(systemStats.users.byRole.admin / systemStats.users.total) * 100}%`}}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-900">{systemStats.users.byRole.admin}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application Statistics */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-medium text-slate-900">Application Statistics</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Total Applications</span>
                  <span className="text-sm text-slate-900">{systemStats.applications.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">This Month</span>
                  <span className="text-sm text-slate-900">{systemStats.applications.thisMonth}</span>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Application Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Applied</span>
                      <span className="text-sm text-slate-900">{systemStats.applications.pending}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Reviewed</span>
                      <span className="text-sm text-slate-900">{systemStats.applications.reviewed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Interviewed</span>
                      <span className="text-sm text-slate-900">{systemStats.applications.interviewed}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Offered</span>
                      <span className="text-sm text-slate-900">{systemStats.applications.offered}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Rejected</span>
                      <span className="text-sm text-slate-900">{systemStats.applications.rejected}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-medium text-slate-900">System Information</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">System Uptime</span>
                  <span className="text-sm text-green-600 font-medium">{systemStats.system.uptime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Version</span>
                  <span className="text-sm text-slate-900">{systemStats.system.version}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Last Update</span>
                  <span className="text-sm text-slate-900">{systemStats.system.lastUpdate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Database Size</span>
                  <span className="text-sm text-slate-900">{systemStats.system.databaseSize}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Storage Used</span>
                  <span className="text-sm text-slate-900">{systemStats.system.storageUsed}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-medium text-slate-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <div className="font-medium text-slate-900">Generate User Report</div>
                  <div className="text-sm text-slate-500">Export all user data to CSV</div>
                </button>
                <button className="w-full text-left px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <div className="font-medium text-slate-900">System Backup</div>
                  <div className="text-sm text-slate-500">Create backup of all data</div>
                </button>
                <button className="w-full text-left px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <div className="font-medium text-slate-900">Clear Cache</div>
                  <div className="text-sm text-slate-500">Clear system cache and temp files</div>
                </button>
                <button className="w-full text-left px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50">
                  <div className="font-medium text-slate-900">Send Notifications</div>
                  <div className="text-sm text-slate-500">Send system notifications to users</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminSystemPage;
