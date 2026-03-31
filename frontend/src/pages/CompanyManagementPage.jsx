import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CompanyManagementPage() {
  const [company, setCompany] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    location: "",
    website: "",
    size: "",
    founded: ""
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

    const user = JSON.parse(userData);
    
    // Mock company data
    setCompany({
      id: 1,
      name: user.company_name || "Tech Solutions Inc",
      description: "Leading technology company specializing in innovative software solutions",
      industry: "Technology",
      location: "San Francisco, CA",
      website: "https://techsolutions.com",
      size: "100-500",
      founded: "2015",
      logo: "/company-logo.png",
      members: [
        { id: 1, name: "John Doe", role: "Admin", email: "john@techsolutions.com" },
        { id: 2, name: "Jane Smith", role: "Recruiter", email: "jane@techsolutions.com" },
        { id: 3, name: "Mike Johnson", role: "Recruiter", email: "mike@techsolutions.com" }
      ]
    });
    
    setFormData({
      name: user.company_name || "Tech Solutions Inc",
      description: "Leading technology company specializing in innovative software solutions",
      industry: "Technology",
      location: "San Francisco, CA",
      website: "https://techsolutions.com",
      size: "100-500",
      founded: "2015"
    });
    
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
    setCompany({
      ...company,
      ...formData
    });
    setEditing(false);
  };

  const handleAddMember = () => {
    const newMember = {
      id: company.members.length + 1,
      name: "New Member",
      role: "Recruiter",
      email: "new@company.com"
    };
    setCompany({
      ...company,
      members: [...company.members, newMember]
    });
  };

  const handleRemoveMember = (memberId) => {
    setCompany({
      ...company,
      members: company.members.filter(member => member.id !== memberId)
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading company data...</p>
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
              <h1 className="text-xl font-semibold text-slate-900">Company Management</h1>
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
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Company Info */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-slate-900">Company Information</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
              </div>

              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
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
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Website</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Company Size</label>
                      <select
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-100">51-100</option>
                        <option value="100-500">100-500</option>
                        <option value="500+">500+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Founded</label>
                      <input
                        type="text"
                        name="founded"
                        value={formData.founded}
                        onChange={handleInputChange}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 text-slate-600 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-xl">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{company.name}</h3>
                      <p className="text-slate-600">{company.industry}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Location</p>
                      <p className="font-medium">{company.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Website</p>
                      <a href={company.website} className="text-indigo-600 hover:text-indigo-800">
                        {company.website}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Company Size</p>
                      <p className="font-medium">{company.size}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Founded</p>
                      <p className="font-medium">{company.founded}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Description</p>
                    <p className="text-slate-700">{company.description}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Team Members */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-slate-900">Team Members</h2>
                <button
                  onClick={handleAddMember}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Add Member
                </button>
              </div>

              <div className="space-y-4">
                {company.members.map((member) => (
                  <div key={member.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-slate-900">{member.name}</h4>
                        <p className="text-sm text-slate-600">{member.role}</p>
                        <p className="text-sm text-slate-500">{member.email}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CompanyManagementPage;
