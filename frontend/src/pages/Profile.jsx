import { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const initialProfile = {
  fullName: "",
  email: "",
  phone: "",
  degree: "",
  university: "",
  graduationYear: "",
  skills: [],
};

function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState({
    ...initialProfile,
    skills: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleEdit = () => {
    setFormData({
      ...profile,
      skills: profile.skills.join(", "),
    });

    setIsEditing(true);
    setMessage("");
    setError("");
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    const updatedProfile = {
      ...formData,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      degree: formData.degree.trim(),
      university: formData.university.trim(),
      graduationYear: formData.graduationYear.trim(),
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    setProfile(updatedProfile);
    setFormData({
      ...updatedProfile,
      skills: updatedProfile.skills.join(", "),
    });

    setIsEditing(false);
    setMessage("Profile saved in this session.");
    setError("");
  };

  const handleCancel = () => {
    setFormData({
      ...profile,
      skills: profile.skills.join(", "),
    });

    setIsEditing(false);
    setMessage("");
    setError("");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">
            Account / User Profile
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            User Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your personal, academic, and skills information.
          </p>
        </div>

        {!isEditing && (
          <Button onClick={handleEdit}>
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile overview */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-semibold text-blue-700">
            {profile.fullName
              ? profile.fullName.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {profile.fullName || "Your Name"}
            </h2>

            <p className="mt-1 text-gray-500">
              {profile.degree || "Your Degree"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {profile.email || "Add your email address"}
            </p>
          </div>
        </div>
      </Card>

      {/* Success and error messages */}
      {message && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal information */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name *
                </label>

                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address *
                </label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>

                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </Card>

          {/* Academic information */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900">
              Academic Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="degree"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Degree
                </label>

                <Input
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech Computer Science"
                />
              </div>

              <div>
                <label
                  htmlFor="university"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  University
                </label>

                <Input
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  placeholder="Enter university name"
                />
              </div>

              <div>
                <label
                  htmlFor="graduationYear"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Graduation Year
                </label>

                <Input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  min="2000"
                  max="2100"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g. 2028"
                />
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900">
              Technical Skills
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Separate skills with commas.
            </p>

            <div className="mt-4">
              <label
                htmlFor="skills"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Skills
              </label>

              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Python, C++, HTML, CSS"
              />
            </div>
          </Card>

          {/* Form actions */}
          <div className="flex flex-wrap gap-3">
            <Button type="submit">
              Save Changes
            </Button>

            <Button type="button" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Personal information */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>

            <div className="mt-5 space-y-4">
              <ProfileField
                label="Full Name"
                value={profile.fullName}
              />

              <ProfileField
                label="Email Address"
                value={profile.email}
              />

              <ProfileField
                label="Phone Number"
                value={profile.phone}
              />
            </div>
          </Card>

          {/* Academic information */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900">
              Academic Information
            </h2>

            <div className="mt-5 space-y-4">
              <ProfileField
                label="Degree"
                value={profile.degree}
              />

              <ProfileField
                label="University"
                value={profile.university}
              />

              <ProfileField
                label="Graduation Year"
                value={profile.graduationYear}
              />
            </div>
          </Card>

          {/* Technical skills */}
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Technical Skills
            </h2>

            {profile.skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-500">
                No skills added yet. Select Edit Profile to add your skills.
              </p>
            )}
          </Card>
        </div>
      )}

      <p className="text-sm text-gray-500">
        Demo only: changes are stored in React state for the current page
        session. Connect a profile API or persistent storage to save changes
        across reloads.
      </p>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-3 last:border-b-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-800">
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default Profile;