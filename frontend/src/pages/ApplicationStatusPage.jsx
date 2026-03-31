import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ApplicationStatusPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    
    // Mock data based on user role
    if (user.role === "user") {
      // Job seeker applications
      setApplications([
        {
          id: 1,
          jobTitle: "Senior Software Engineer",
          company: "Tech Solutions Inc",
          status: "applied",
          appliedDate: "2024-03-15",
          lastUpdate: "2024-03-15",
          location: "San Francisco, CA"
        },
        {
          id: 2,
          jobTitle: "Frontend Developer",
          company: "Digital Agency",
          status: "reviewed",
          appliedDate: "2024-03-10",
          lastUpdate: "2024-03-12",
          location: "New York, NY"
        },
        {
          id: 3,
          jobTitle: "Full Stack Developer",
          company: "StartupXYZ",
          status: "interviewed",
          appliedDate: "2024-03-05",
          lastUpdate: "2024-03-08",
          location: "Remote"
        }
      ]);
    } else if (user.role === "recruiter") {
      // Recruiter's job postings and applicants
      setApplications([
        {
          id: 1,
          jobTitle: "Senior Software Engineer",
          company: "Tech Solutions Inc",
          applicants: [
            { id: 1, name: "John Doe", status: "applied", appliedDate: "2024-03-15" },
            { id: 2, name: "Jane Smith", status: "reviewed", appliedDate: "2024-03-14" },
            { id: 3, name: "Mike Johnson", status: "interviewed", appliedDate: "2024-03-13" }
          ]
        },
        {
          id: 2,
          jobTitle: "Frontend Developer",
          company: "Tech Solutions Inc",
          applicants: [
            { id: 4, name: "Sarah Wilson", status: "applied", appliedDate: "2024-03-16" },
            { id: 5, name: "Tom Brown", status: "reviewed", appliedDate: "2024-03-15" }
          ]
        }
      ]);
    }
    
    setLoading(false);
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "applied": return "bg-blue-100 text-blue-800";
      case "reviewed": return "bg-yellow-100 text-yellow-800";
      case "interviewed": return "bg-purple-100 text-purple-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "offer": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const updateApplicationStatus = (appId, newStatus) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return { ...app, status: newStatus, lastUpdate: new Date().toISOString().split('T')[0] };
      }
      return app;
    }));
  };

  const updateApplicantStatus = (jobId, applicantId, newStatus) => {
    setApplications(prev => prev.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          applicants: job.applicants.map(applicant => {
            if (applicant.id === applicantId) {
              return { ...applicant, status: newStatus };
            }
            return applicant;
          })
        };
      }
      return job;
    }));
  };

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const isRecruiter = userData.role === "recruiter";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading applications...</p>
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
              <h1 className="text-xl font-semibold text-slate-900">
                {isRecruiter ? "Applicant Management" : "My Applications"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="reviewed">Reviewed</option>
                <option value="interviewed">Interviewed</option>
                <option value="rejected">Rejected</option>
                <option value="offer">Offer</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!isRecruiter ? (
          // Job Seeker View
          <div className="space-y-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-slate-900">{app.jobTitle}</h3>
                    <p className="text-slate-600">{app.company}</p>
                    <p className="text-sm text-slate-500">{app.location}</p>
                    <div className="mt-4 flex items-center space-x-4 text-sm text-slate-500">
                      <span>Applied: {app.appliedDate}</span>
                      <span>Updated: {app.lastUpdate}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Recruiter View
          <div className="space-y-6">
            {applications.map((job) => (
              <div key={job.id} className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-slate-200">
                  <h3 className="text-lg font-medium text-slate-900">{job.jobTitle}</h3>
                  <p className="text-slate-600">{job.company}</p>
                  <p className="text-sm text-slate-500">{job.applicants.length} applicants</p>
                </div>
                <div className="divide-y divide-slate-200">
                  {job.applicants.map((applicant) => (
                    <div key={applicant.id} className="px-6 py-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-slate-900">{applicant.name}</p>
                          <p className="text-sm text-slate-500">Applied: {applicant.appliedDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(applicant.status)}`}>
                            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                          </span>
                          <select
                            value={applicant.status}
                            onChange={(e) => updateApplicantStatus(job.id, applicant.id, e.target.value)}
                            className="text-sm border border-slate-300 rounded px-2 py-1"
                          >
                            <option value="applied">Applied</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="rejected">Rejected</option>
                            <option value="offer">Offer</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ApplicationStatusPage;
