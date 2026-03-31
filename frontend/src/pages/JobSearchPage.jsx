import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function JobSearchPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    // Mock job data
    const mockJobs = [
      {
        id: 1,
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc",
        location: "San Francisco, CA",
        type: "full-time",
        salary: "$120,000 - $180,000",
        description: "We are looking for an experienced software engineer to join our team and work on cutting-edge projects.",
        requirements: "5+ years of experience in software development, strong knowledge of React, Node.js, and cloud technologies.",
        postedDate: "2024-03-15",
        deadline: "2024-04-15",
        applicants: 12,
        logo: "/company1.png"
      },
      {
        id: 2,
        title: "Frontend Developer",
        company: "Digital Agency",
        location: "Remote",
        type: "full-time",
        salary: "$80,000 - $120,000",
        description: "Join our creative team to build amazing user interfaces and experiences for our clients.",
        requirements: "3+ years of experience with React, TypeScript, and modern CSS frameworks.",
        postedDate: "2024-03-10",
        deadline: "2024-04-10",
        applicants: 8,
        logo: "/company2.png"
      },
      {
        id: 3,
        title: "Product Manager",
        company: "StartupXYZ",
        location: "New York, NY",
        type: "full-time",
        salary: "$100,000 - $150,000",
        description: "Lead product strategy and development for our innovative SaaS platform.",
        requirements: "3+ years of product management experience, strong analytical skills, and startup experience.",
        postedDate: "2024-03-08",
        deadline: "2024-04-08",
        applicants: 15,
        logo: "/company3.png"
      },
      {
        id: 4,
        title: "Data Scientist",
        company: "AI Corp",
        location: "Boston, MA",
        type: "full-time",
        salary: "$110,000 - $160,000",
        description: "Apply machine learning techniques to solve complex business problems.",
        requirements: "PhD or Masters in Computer Science, experience with Python, TensorFlow, and data analysis.",
        postedDate: "2024-03-05",
        deadline: "2024-04-05",
        applicants: 20,
        logo: "/company4.png"
      },
      {
        id: 5,
        title: "UX Designer",
        company: "Design Studio",
        location: "Los Angeles, CA",
        type: "contract",
        salary: "$60,000 - $90,000",
        description: "Create beautiful and intuitive user experiences for web and mobile applications.",
        requirements: "3+ years of UX design experience, proficiency in Figma and Adobe Creative Suite.",
        postedDate: "2024-03-01",
        deadline: "2024-04-01",
        applicants: 6,
        logo: "/company5.png"
      }
    ];
    
    setJobs(mockJobs);
    setFilteredJobs(mockJobs);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    // Filter jobs based on search criteria
    let filtered = jobs;
    
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedLocation) {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }
    
    if (selectedType) {
      filtered = filtered.filter(job => job.type === selectedType);
    }
    
    if (selectedSalary) {
      filtered = filtered.filter(job => job.salary.includes(selectedSalary));
    }
    
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedLocation, selectedType, selectedSalary]);

  const handleApply = (jobId) => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    
    // Get existing applications from localStorage
    const applications = JSON.parse(localStorage.getItem("userApplications") || "[]");
    
    // Check if already applied
    if (applications.find(app => app.jobId === jobId)) {
      alert("You have already applied for this job!");
      return;
    }
    
    // Create new application
    const newApplication = {
      id: applications.length + 1,
      jobId: jobId,
      jobTitle: jobs.find(job => job.id === jobId)?.title,
      company: jobs.find(job => job.id === jobId)?.company,
      appliedDate: new Date().toISOString().split('T')[0],
      status: "applied",
      lastUpdated: new Date().toISOString().split('T')[0],
      resume: "Default Resume.pdf",
      coverLetter: "I am excited to apply for this position..."
    };
    
    // Save application
    applications.push(newApplication);
    localStorage.setItem("userApplications", JSON.stringify(applications));
    
    alert("Application submitted successfully! You can track your application status in the Applications page.");
    navigate("/applications");
  };

  const handleSaveJob = (jobId) => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    if (savedJobs.includes(jobId)) {
      // Remove from saved
      const updated = savedJobs.filter(id => id !== jobId);
      localStorage.setItem("savedJobs", JSON.stringify(updated));
      alert("Job removed from saved jobs");
    } else {
      // Add to saved
      savedJobs.push(jobId);
      localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
      alert("Job saved for later!");
    }
  };

  const isJobSaved = (jobId) => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    return savedJobs.includes(jobId);
  };

  const isJobApplied = (jobId) => {
    const applications = JSON.parse(localStorage.getItem("userApplications") || "[]");
    return applications.find(app => app.jobId === jobId);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading job opportunities...</p>
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
              <h1 className="text-xl font-semibold text-slate-900">Job Search</h1>
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
        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search Jobs</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, company, or keywords..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="San Francisco, CA">San Francisco, CA</option>
                <option value="New York, NY">New York, NY</option>
                <option value="Boston, MA">Boston, MA</option>
                <option value="Los Angeles, CA">Los Angeles, CA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Job Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Salary Range</label>
              <select
                value={selectedSalary}
                onChange={(e) => setSelectedSalary(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Salaries</option>
                <option value="60,000">$60,000+</option>
                <option value="80,000">$80,000+</option>
                <option value="100,000">$100,000+</option>
                <option value="120,000">$120,000+</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-slate-600">
              {filteredJobs.length} jobs found
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLocation("");
                setSelectedType("");
                setSelectedSalary("");
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <div className="text-slate-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search criteria or filters</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLocation("");
                  setSelectedType("");
                  setSelectedSalary("");
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const applied = isJobApplied(job.id);
              const saved = isJobSaved(job.id);
              
              return (
                <div key={job.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <span className="text-indigo-600 font-bold">
                            {job.company.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-slate-900">{job.title}</h3>
                          <p className="text-slate-600">{job.company}</p>
                        </div>
                      </div>
                      
                      <p className="text-slate-700 mb-4">{job.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {job.type}
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          {job.salary}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-500">
                          <span>Posted: {job.postedDate}</span>
                          <span className="mx-2">•</span>
                          <span>Deadline: {job.deadline}</span>
                          <span className="mx-2">•</span>
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-6">
                      <button
                        onClick={() => handleApply(job.id)}
                        disabled={applied}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          applied 
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                      >
                        {applied ? "Applied" : "Apply Now"}
                      </button>
                      <button
                        onClick={() => handleSaveJob(job.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                          saved 
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700" 
                            : "border-slate-300 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {saved ? "Saved" : "Save Job"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default JobSearchPage;
