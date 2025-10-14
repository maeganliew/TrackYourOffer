import React, { useState, useEffect } from 'react';
import ProfileForm from '../components/ProfileForm';
import api from '../api/axios';
import toast from 'react-hot-toast';
//import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'



const Profile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  //const navigate = useNavigate();

  useEffect(() => {
    // In a real app, you might want to fetch fresh user data
    // fetchUserProfile();
  }, []);

  const { user, logout } = useAuth();

  const handleUpdatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      await api.patch('/user/changePassword', {
        currentPassword,
        newPassword,
      });
      
      toast.success('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // const handleLogout = () => {
  //   clearAuth(); // clear token & user from localStorage
  //   toast.success('Logged out successfully!');
  //   navigate('/login'); // redirect to login page
  // };

  if (!user) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Unable to load user profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="max-w-2xl">
        <ProfileForm
          user={user}
          onUpdatePassword={handleUpdatePassword}
          isLoading={isLoading}
        />
      </div>
      <div className="mt-10">
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
      >
        Logout
      </button>
      </div>
    </div>
  );
};

export default Profile;