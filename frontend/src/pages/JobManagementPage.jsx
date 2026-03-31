import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function JobManagementPage() {
  const [jobs, setJobs] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    type: "full-time",
    salary: "",
    department: ""
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    // Mock job data
    setJobs([
      {
        id: 1,
        title: "Senior Software Engineer",
        description: "We are looking for an experienced software engineer to join our team.",
        requirements: "5+ years of experience, React, Node.js, AWS",
        location: "San Francisco, CA",
        type: "full-time",
        salary: "$120,000 - $180,000",
        department: "Engineering",
        status: "active",
        postedDate: "2024-03-15",
        applicants: 12
      },
      {
        id: 2,
        title: "Frontend Developer",
        description: "Join our frontend team to build amazing user experiences.",
        requirements: "3+ years of experience, React, TypeScript, CSS",
        location: "Remote",
        type: "full-time",
        salary: "$80,000 - $120,000",
        department: "Engineering",
        status: "active",
        postedDate: "2024-03-10",
        applicants: 8
      },
      {
        id: 3,
        title: "Product Manager",
        description: "Lead product strategy and development for our core products.",
        requirements: "3+ years of product management experience",
        location: "New York, NY",
        type: "full-time",
        salary: "$100,000 - $150,000",
        department: "Product",
        status: "closed",
        postedDate: "2024-03-05",
        applicants: 15
      }
    ]);
    
    setLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingJob) {
      // Update existing job
      setJobs(jobs.map(job => 
        job.id === editingJob.id 
          ? { ...job, ...formData }
          : job
      ));
    } else {
      // Create new job
      const newJob = {
        id: jobs.length + 1,
        ...formData,
        status: "active",
        postedDate: new Date().toISOString().split('T')[0],
        applicants: 0
      };
      setJobs([...jobs, newJob]);
    }
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      requirements: "",
      location: "",
      type: "full-time",
      salary: "",
      department: ""
    });
    setEditingJob(null);
    setShowCreateModal(false);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      type: job.type,
      salary: job.salary,
      department: job.department
    });
    setShowCreateModal(true);
  };

  const handleDelete = (jobId) => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      setJobs(jobs.filter(job => job.id !== jobId));
    }
  };

  const handleToggleStatus = (jobId) => {
    setJobs(jobs.map(job => 
      job.id === jobId 
        ? { ...job, status: job.status === "active" ? "closed" : "active" }
        : job
    ));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading job postings...</p>
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
              <h1 className="text-xl font-semibold text-slate-900">Job Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Post New Job
              </button>
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
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Job Listings */}
            <div className="space-y-6">
              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No job postings</h3>
                  <p className="text-slate-500 mb-4">Create your first job posting to start recruiting</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Post New Job
                  </button>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-slate-900">{job.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            job.status === "active" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        
                        <p className="text-slate-600 mb-3">{job.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-slate-500">Location</p>
                            <p className="font-medium">{job.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Type</p>
                            <p className="font-medium capitalize">{job.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Salary</p>
                            <p className="font-medium">{job.salary}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Applicants</p>
                            <p className="font-medium">{job.applicants}</p>
                          </div>
                        </div>
                        
                        <div className="text-sm text-slate-500">
                          <p>Requirements: {job.requirements}</p>
                          <p>Posted: {job.postedDate}</p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(job.id)}
                          className="text-slate-600 hover:text-slate-800 text-sm font-medium"
                        >
                          {job.status === "active" ? "Close" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create/Edit Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-medium text-slate-900 mb-4">
              {editingJob ? "Edit Job Posting" : "Create New Job Posting"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g., $80,000 - $120,000"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingJob(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  {editingJob ? "Update Job" : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobManagementPage;
