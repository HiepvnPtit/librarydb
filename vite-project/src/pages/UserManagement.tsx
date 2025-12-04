import TopBar from "../components/TopBar";
import { Plus, Search, Mail, Phone, Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import type { User } from '../hooks/useManagementHooks';
import { useUserData } from '../hooks/useManagementHooks';
import { deleteUser } from "../api/apiService";
import { searchItems } from "../service/SearchingItem";
import CreateUserForm from "../components/forms/CreateUserForm";

// Map API user response to display format
const formatUserForDisplay = (user: User) => ({
  id: user.id,
  userCode: user.userCode,
  name: user.username,
  role: user.roles?.[0] || 'Member',
  email: user.email,
  phone: user.phoneNumber,
  avatar: (user.username?.charAt(0) || 'U').toUpperCase(),
  bg: `hsl(${user.id * 60}, 70%, 60%)`,
  status: user.status || 'ACTIVE',
  bookQuota: user.bookQuota || 0,
});

export default function UserManagement() {
  const { data: users, loading, refetch: refetchUsers } = useUserData(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchItems(query, "users", { users });
      setSearchResults((results as User[]) || []);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = (id: number) => {
    return window.confirm(`Are you sure you want to delete user with ID: ${id}?`);
  };

  const displayUsers = searchResults !== null ? searchResults : (users as User[]);
  const displayData = displayUsers.map(formatUserForDisplay);

  return (
    <div>
      <TopBar title="User Management" />
      {/* Filter / Search Bar */}
      <div className="card filter-bar">
        <div className="search-wrapper">
          <Search size={18} color="#A3AED0" />
          <input 
            placeholder="Search by username or email..." 
            className="search-input-field"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        <button className="btn-primary" onClick={() => setIsCreateUserModalOpen(true)}>
          <Plus size={18} /> Create User
        </button>
      </div>

      {/* Loading State */}
      {(loading || isSearching) && (
        <div className="empty-state">
          <Loader2 className="animate-spin" size={30} />
          <p>Loading users...</p>
        </div>
      )}

      {/* Grid Layout */}
      {!loading && !isSearching && (
        <div className="user-grid">
          {displayData.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <p>No users found.</p>
            </div>
          ) : (
            displayData.map((user) => (
              <div key={user.id} className="card user-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                {/* Left Section: Avatar & Info */}
                <div>
                  <div className="user-avatar" style={{ background: user.bg }}>
                    {user.avatar}
                  </div>
                  
                  <h3 className="user-name">{user.name}</h3>
                  <p className="user-role">{user.role}</p>
                  <p style={{ fontSize: '12px', color: '#000000ff', marginBottom: '8px' }}>{user.userCode}</p>
                </div>
                
                {/* Right Section: Contact & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                  <div className="card-footer" style={{ gap: '8px', flexDirection: 'column' }}>
                    <button className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Edit size={16} /> Edit
                    </button>
                    <button 
                      className="btn-link" 
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E74C3C' }}
                      onClick={() => { if (handleDelete(user.id)) { deleteUser(user.id); } }}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create User Form */}
      <CreateUserForm
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onSuccess={() => {
          refetchUsers && refetchUsers();
          setIsCreateUserModalOpen(false);
        }}
      />
    </div>
  );
}