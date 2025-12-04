{
  "username": "string",
  "password": "stringst",
  "birthDate": "2025-12-04",
  "email": "string",
  "phoneNumber": "string",
  "location": "string"
}

import TopBar from "../components/TopBar";
import { Plus, Search, MoreHorizontal, Mail, Phone } from "lucide-react";
import { useState } from "react";

export default function UserManagement() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    birthDate: "",
    email: "",
    phone: "",
    location: ""
  });

  const users = [
    { id: 1, name: "Jason Statham", role: "Librarian", email: "jason@lib.com", phone: "0909 111 222", avatar: "JS", bg: "#FF8F6B" },
    { id: 2, name: "Dua Lipa", role: "Member", email: "dua@pop.com", phone: "0909 333 444", avatar: "DL", bg: "#6A5AE0" },
    { id: 3, name: "Chris Evans", role: "Member", email: "chris@cap.com", phone: "0909 555 666", avatar: "CE", bg: "#05CD99" },
    { id: 4, name: "Scarlett", role: "Librarian", email: "widow@avengers.com", phone: "0909 777 888", avatar: "SJ", bg: "#4318FF" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Xử lý logic submit ở đây
    setShowModal(false);
    // Reset form
    setFormData({
      name: "",
      password: "",
      birthDate: "",
      email: "",
      phone: "",
      location: ""
    });
  };

  return (
    <div>
      <TopBar title="User Management" />
      
      {/* Filter / Search Bar */}
      <div className="card filter-bar">
        <div className="search-wrapper">
          <Search size={18} color="#A3AED0" />
          <input 
            placeholder="Search by user or book..." 
            className="search-input-field" 
          />
        </div>
        
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Create Slip
        </button>
      </div>

      {/* Grid Layout */}
      <div className="user-grid">
        {users.map((user) => (
          <div key={user.id} className="card user-card">
            
            {/* Avatar - Background giữ inline vì nó động theo data */}
            <div className="user-avatar" style={{ background: user.bg }}>
              {user.avatar}
            </div>
            
            {/* Info */}
            <h3 className="user-name">{user.name}</h3>
            <p className="user-role">{user.role}</p>
            
            {/* Contact List */}
            <div className="contact-list">
              <div className="contact-item">
                <Mail size={18} /> {user.email}
              </div>
              <div className="contact-item">
                <Phone size={18} /> {user.phone}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="card-footer">
              <button className="btn-link">View Profile</button>
              <MoreHorizontal size={20} className="icon-btn" color="#A3AED0" />
            </div>
            
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay-user" onClick={() => setShowModal(false)}>
          <div className="modal-content-user" onClick={(e) => e.stopPropagation()}>
            <form className="user-form-user" onSubmit={handleSubmit}>
              <div className="form-group-user">
                <label>Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input-user"
                  required
                />
              </div>

              <div className="form-group-user">
                <label>Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="form-input-user"
                  required
                />
              </div>

              <div className="form-group-user">
                <label>Birth Date</label>
                <input 
                  type="date" 
                  value={formData.birthDate}
                  onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  className="form-input-user"
                  required
                />
              </div>

              <div className="form-group-user">
                <label>Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="form-input-user"
                  required
                />
              </div>

              <div className="form-group-user">
                <label>Phone number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="form-input-user"
                  required
                />
              </div>

              <div className="form-group-user">
                <label>Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="form-input-user"
                  required
                />
              </div>

              <div className="form-actions-user">
                <button type="submit" className="btn-submit-user">Submit</button>
                <button type="button" className="btn-cancel-user" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}