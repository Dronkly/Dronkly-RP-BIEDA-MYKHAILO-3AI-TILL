import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1>Můj profil</h1>
        <p><strong>Jméno:</strong> {user.name}</p>
        <p><strong>Příjmení:</strong> {user.surname}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;