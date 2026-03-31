import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EnhancedResumePage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeTitle, setResumeTitle] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(userData);
    
    // Mock resume data
    setResumes([
      {
        id: 1,
        title: "John Doe Resume",
        fileName: "john_doe_resume.pdf",
        uploadedDate: "2024-03-15",
        fileSize: "245 KB",
        isDefault: true,
        isPublic: true,
        downloadCount: 12,
        lastAccessed: "2024-03-20"
      },
      {
        id: 2,
        title: "Technical Resume",
        fileName: "technical_resume.pdf",
        uploadedDate: "2024-03-10",
        fileSize: "189 KB",
        isDefault: false,
        isPublic: false,
        downloadCount: 5,
        lastAccessed: "2024-03-18"
      }
    ]);
    
    setLoading(false);
  }, [navigate]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.includes('pdf') && !file.name.endsWith('.doc') && !file.name.endsWith('.docx')) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setResumeTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !resumeTitle.trim()) {
      alert('Please select a file and enter a title');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate upload completion
    setTimeout(() => {
      const newResume = {
        id: resumes.length + 1,
        title: resumeTitle,
        fileName: selectedFile.name,
        uploadedDate: new Date().toISOString().split('T')[0],
        fileSize: `${(selectedFile.size / 1024).toFixed(0)} KB`,
        isDefault: resumes.length === 0,
        isPublic: false,
        downloadCount: 0,
        lastAccessed: new Date().toISOString().split('T')[0]
      };

      setResumes([...resumes, newResume]);
      setUploading(false);
      setUploadProgress(0);
      setSelectedFile(null);
      setResumeTitle("");
      setShowUploadModal(false);
    }, 2000);
  };

  const handleDelete = (resumeId) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      setResumes(resumes.filter(resume => resume.id !== resumeId));
    }
  };

  const handleSetDefault = (resumeId) => {
    setResumes(resumes.map(resume => ({
      ...resume,
      isDefault: resume.id === resumeId
    })));
  };

  const handleTogglePrivacy = (resumeId) => {
    setResumes(resumes.map(resume => {
      if (resume.id === resumeId) {
        return { ...resume, isPublic: !resume.isPublic };
      }
      return resume;
    }));
  };

  const handleDownload = (resume) => {
    // Simulate download
    alert(`Downloading ${resume.fileName}...`);
    // Increment download count
    setResumes(resumes.map(r => 
      r.id === resume.id 
        ? { ...r, downloadCount: r.downloadCount + 1, lastAccessed: new Date().toISOString().split('T')[0] }
        : r
    ));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading resumes...</p>
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
              <h1 className="text-xl font-semibold text-slate-900">Resume Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Upload Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Resume List */}
            <div className="space-y-4">
              {resumes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-slate-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No resumes uploaded</h3>
                  <p className="text-slate-500 mb-4">Upload your first resume to get started</p>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Upload Resume
                  </button>
                </div>
              ) : (
                resumes.map((resume) => (
                  <div key={resume.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="text-slate-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-slate-900">{resume.title}</h3>
                            <p className="text-sm text-slate-500">{resume.fileName}</p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                              <span>{resume.fileSize}</span>
                              <span>Uploaded: {resume.uploadedDate}</span>
                              <span>Downloads: {resume.downloadCount}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Badges */}
                        <div className="flex items-center space-x-2 mt-3">
                          {resume.isDefault && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Default
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            resume.isPublic 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {resume.isPublic ? "Public" : "Private"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleDownload(resume)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleSetDefault(resume.id)}
                          disabled={resume.isDefault}
                          className="text-slate-600 hover:text-slate-800 text-sm font-medium disabled:opacity-50"
                        >
                          Set Default
                        </button>
                        <button
                          onClick={() => handleTogglePrivacy(resume.id)}
                          className="text-slate-600 hover:text-slate-800 text-sm font-medium"
                        >
                          {resume.isPublic ? "Make Private" : "Make Public"}
                        </button>
                        <button
                          onClick={() => handleDelete(resume.id)}
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Upload Resume</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Resume Title</label>
              <input
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter resume title"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Select File</label>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500 mt-1">PDF, DOC, or DOCX files (Max 5MB)</p>
            </div>
            
            {selectedFile && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Selected:</strong> {selectedFile.name}
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Size:</strong> {(selectedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
            )}
            
            {uploading && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedResumePage;
