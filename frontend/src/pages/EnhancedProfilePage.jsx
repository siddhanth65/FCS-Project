import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";

function EnhancedProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    headline: "",
    location: "",
    bio: "",
    profile_picture: "",
    privacy_level: "public"
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          first_name: parsedUser.first_name || "",
          last_name: parsedUser.last_name || "",
          email: parsedUser.email || "",
          mobile: parsedUser.mobile || "",
          headline: parsedUser.headline || "",
          location: parsedUser.location || "",
          bio: parsedUser.bio || "",
          profile_picture: parsedUser.profile_picture || "",
          privacy_level: parsedUser.privacy_level || "public"
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await userAPI.updateProfile(formData);
      setMessage("Profile updated successfully!");
      setEditing(false);

      // Update localStorage with new user data
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...userData, ...formData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      setMessage("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: Implement profile picture upload
      console.log("Profile picture selected:", file);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-slate-900">My Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setEditing(!editing)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                {editing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 sm:pb-8">
            <div className="space-y-6">
              {/* Success/Error Message */}
              {message && (
                <div className={`rounded-lg border px-3 py-2 text-sm ${message.includes("success")
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
                  }`}>
                  {message}
                </div>
              )}

              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <img
                    className="h-24 w-24 rounded-full object-cover bg-slate-200"
                    src={formData.profile_picture || `https://ui-avatars.com/api/?name=${formData.first_name}+${formData.last_name}&background=random`}
                    alt="Profile"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-slate-900">Profile Picture</h3>
                  {editing && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="mt-2 block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:border-0
                          file:text-slate-300 file:button file:button file:rounded-full file:border-slate-200 file:cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Basic Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Mobile</label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        disabled={!editing}
                        className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-4">Professional Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Headline</label>
                      <input
                        type="text"
                        name="headline"
                        value={formData.headline}
                        onChange={handleInputChange}
                        disabled={!editing}
                        placeholder="e.g., Senior Software Engineer"
                        className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={!editing}
                        placeholder="e.g., San Francisco, CA"
                        className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!editing}
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-slate-900 mb-4">Privacy Settings</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Profile Visibility</label>
                    <select
                      name="privacy_level"
                      value={formData.privacy_level}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="mt-1 block w-full border border-slate-300 rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-slate-100"
                    >
                      <option value="public">Public - Anyone can view</option>
                      <option value="connections">Connections Only - Only connections can view</option>
                      <option value="private">Private - Only you can view</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {editing && (
                <div className="flex justify-end pt-6">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EnhancedProfilePage;
