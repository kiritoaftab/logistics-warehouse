import React, { useState } from "react";
import PageHeader from "../components/PageHeader";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Edit,
  Save,
} from "lucide-react";

const Setting = () => {
  const [isEditing, setIsEditing] = useState(false);

  // User data
  const [userData, setUserData] = useState({
    fullName: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    position: "Shipping Manager",
    department: "Operations",
    employeeId: "EMP-2024-001",
    joinDate: "Jan 15, 2023",
    address: "123 Main Street, New York, NY 10001",
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle save
  const handleSave = () => {
    setIsEditing(false);
    console.log("Profile saved:", userData);
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Profile"
        subtitle="Manage your account information"
        actions={
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ${
              isEditing
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isEditing ? <Save size={16} /> : <Edit size={16} />}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Summary */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
                <User size={64} className="text-blue-600" />
              </div>

              {/* User Info */}
              <h2 className="mb-2 text-xl font-bold text-gray-900">
                {userData.fullName}
              </h2>
              <p className="mb-4 text-gray-600">{userData.position}</p>

              {/* Quick Stats */}
              <div className="grid w-full grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-sm text-gray-600">Employee ID</p>
                  <p className="font-semibold">{userData.employeeId}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold">{userData.department}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{userData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{userData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{userData.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Joined</p>
                  <p className="font-medium">{userData.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              {isEditing ? "Edit Profile Information" : "Profile Information"}
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    {userData.fullName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    {userData.email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    {userData.phone}
                  </div>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Position
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userData.position}
                    onChange={(e) =>
                      handleInputChange("position", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    {userData.position}
                  </div>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Department
                </label>
                {isEditing ? (
                  <select
                    value={userData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option>Operations</option>
                    <option>Warehouse</option>
                    <option>Shipping</option>
                    <option>Finance</option>
                    <option>Management</option>
                  </select>
                ) : (
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    {userData.department}
                  </div>
                )}
              </div>

              {/* Employee ID */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Employee ID
                </label>
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                  {userData.employeeId}
                </div>
              </div>

              {/* Join Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Join Date
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={userData.joinDate}
                    onChange={(e) =>
                      handleInputChange("joinDate", e.target.value)
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    {userData.joinDate}
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={userData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    rows="3"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                ) : (
                  <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    {userData.address}
                  </div>
                )}
              </div>
            </div>

            {/* Save/Cancel Buttons (only shown in edit mode) */}
            {isEditing && (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Additional Info Card */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 p-4">
                <Building size={20} className="mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Company</p>
                <p className="font-semibold">Logistics Co.</p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <User size={20} className="mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Role</p>
                <p className="font-semibold">Manager</p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <Calendar size={20} className="mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-semibold">Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
