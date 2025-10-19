// src/pages/Settings.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import GlassCard from '../components/Layout/GlassCard';
import { Icons } from '../components/common/Icons';

const Settings = () => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Initialize form when user data loads
  React.useEffect(() => {
    if (user || userProfile) {
      setEditForm({
        name: user?.displayName || userProfile?.name || '',
        bio: userProfile?.bio || ''
      });
    }
  }, [user, userProfile]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdateError('');
    setUpdateSuccess(false);
    
    // Reset form to current values when canceling
    if (isEditing) {
      setEditForm({
        name: user?.displayName || userProfile?.name || '',
        bio: userProfile?.bio || ''
      });
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError('');
    setUpdateSuccess(false);

    const result = await updateUserProfile(editForm);
    
    if (result.success) {
      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } else {
      setUpdateError(result.error);
    }
    
    setUpdateLoading(false);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: Icons.user },
    { id: 'account', name: 'Account', icon: Icons.settings },
  ];

  return (
    <div className="h-full p-8 flex flex-col">
      <header className="mb-8">
        <h1 
          className="text-3xl font-bold text-gray-800 dark:text-white"
          style={{ color: isDarkMode ? 'white' : undefined }}
        >
          Settings
        </h1>
        <p 
          className="mt-1 text-gray-600 dark:text-white"
          style={{ color: isDarkMode ? 'white' : undefined }}
        >
          Manage your account and preferences.
        </p>
      </header>

      <div className="flex gap-8 h-full">
        {/* Sidebar */}
        <div className="w-64">
          <GlassCard className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-500/20 text-blue-500'
                      : 'hover:bg-gray-500/10 text-gray-600 dark:text-white'
                  }`}
                  style={{
                    color: activeTab === tab.id 
                      ? '#3b82f6' 
                      : (isDarkMode ? 'white' : undefined)
                  }}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </GlassCard>
        </div>

        {/* Content */}
        <div className="flex-1">
          <GlassCard className="p-6 h-full">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 
                    className="text-xl font-semibold text-gray-800 dark:text-white"
                    style={{ color: isDarkMode ? 'white' : undefined }}
                  >
                    Profile Information
                  </h2>
                  <button
                    onClick={handleEditToggle}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isEditing 
                        ? 'bg-gray-500/20 text-gray-600 dark:text-white hover:bg-gray-500/30' 
                        : 'bg-blue-500/20 text-blue-600 dark:text-white hover:bg-blue-500/30'
                    }`}
                    style={{ color: isDarkMode ? 'white' : undefined }}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                {/* Success Message */}
                {updateSuccess && (
                  <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-600 dark:text-green-400 text-sm">
                      ✅ Profile updated successfully!
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {updateError && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 text-sm">
                      ❌ {updateError}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-tr from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="font-bold text-white text-2xl">
                      {(editForm.name || user?.displayName || user?.email)?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 
                      className="text-lg font-semibold text-gray-800 dark:text-white"
                      style={{ color: isDarkMode ? 'white' : undefined }}
                    >
                      {user?.displayName || userProfile?.name || 'User'}
                    </h3>
                    <p 
                      className="text-gray-600 dark:text-white"
                      style={{ color: isDarkMode ? 'white' : undefined }}
                    >
                      {user?.email}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label 
                        className="block text-sm font-medium mb-2 text-gray-700 dark:text-white"
                        style={{ color: isDarkMode ? 'white' : undefined }}
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        required
                        className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 backdrop-blur-sm transition-all ${
                          isEditing 
                            ? 'bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                            : 'bg-white/50 dark:bg-black/20'
                        }`}
                        style={{ 
                          color: isDarkMode ? 'white' : '#374151',
                          backgroundColor: isEditing 
                            ? (isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)')
                            : (isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)')
                        }}
                      />
                    </div>
                    <div>
                      <label 
                        className="block text-sm font-medium mb-2 text-gray-700 dark:text-white"
                        style={{ color: isDarkMode ? 'white' : undefined }}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                        style={{ 
                          color: isDarkMode ? '#ffffff' : '#374151',
                          backgroundColor: isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)'
                        }}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1"style={{ 
                          color: isDarkMode ? '#ffffff' : '#374151'
                        }}>
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  <div>
                    <label 
                      className="block text-sm font-medium mb-2 text-gray-700 dark:text-white"
                      style={{ color: isDarkMode ? 'white' : undefined }}
                    >
                      Bio (Optional)
                    </label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      readOnly={!isEditing}
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 backdrop-blur-sm transition-all resize-none ${
                        isEditing 
                          ? 'bg-white/70 dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-blue-500' 
                          : 'bg-white/50 dark:bg-black/20'
                      }`}
                      style={{ 
                        color: isDarkMode ? 'white' : '#374151',
                        backgroundColor: isEditing 
                          ? (isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.7)')
                          : (isDarkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)')
                      }}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={updateLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {updateLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="bg-gray-500/20 text-gray-600 dark:text-gray-400 px-6 py-3 rounded-lg font-semibold hover:bg-gray-500/30 transition-all duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>

                {!isEditing && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p 
                      className="text-sm text-blue-600 dark:text-blue-400"
                      style={{ color: isDarkMode ? '#ffffff' : '#2563eb' }}
                    >
                      <strong>💡 Tip:</strong> Click "Edit Profile" to update your name and bio. Changes will be saved to your account and reflected across the app.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 
                  className="text-xl font-semibold text-gray-800 dark:text-white"
                  style={{ color: isDarkMode ? 'white' : undefined }}
                >
                  Account Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-black/20 rounded-lg">
                    <div>
                      <h3 
                        className="font-medium text-gray-800 dark:text-white"
                        style={{ color: isDarkMode ? 'white' : undefined }}
                      >
                        Account Status
                      </h3>
                      <p 
                        className="text-sm text-gray-600 dark:text-white"
                        style={{ color: isDarkMode ? 'white' : undefined }}
                      >
                        Your account is active and verified
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium" style={{ color: isDarkMode ? '#ffffff' : undefined }}>
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-black/20 rounded-lg">
                    <div>
                      <h3 
                        className="font-medium text-gray-800 dark:text-white"
                        style={{ color: isDarkMode ? 'white' : undefined }}
                      >
                        Member Since
                      </h3>
                      <p 
                        className="text-sm text-gray-600 dark:text-white"
                        style={{ color: isDarkMode ? 'white' : undefined }}
                      >
                        {user?.metadata?.creationTime ? 
                          new Date(user.metadata.creationTime).toLocaleDateString() : 
                          'Recently'
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-black/20 rounded-lg">
                    <div>
                      <h3 
                        className="font-medium text-gray-800 dark:text-white"
                        style={{ color: isDarkMode ? 'white' : undefined }}
                      >
                        Last Sign In
                      </h3>
                      <p 
                        className="text-sm text-gray-600 dark:text-white"
                        style={{ color: isDarkMode ? 'white' : undefined }}
                      >
                        {user?.metadata?.lastSignInTime ? 
                          new Date(user.metadata.lastSignInTime).toLocaleDateString() : 
                          'Today'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                  <p 
                    className="text-sm text-yellow-600 dark:text-yellow-400"
                    style={{ color: isDarkMode ? '#fbbf24' : '#d97706' }}
                  >
                    <strong>Coming Soon:</strong> Password change, account deletion, and more account management features.
                  </p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Settings;
