import { useState } from "react";
import TopBar from "../components/TopBar";
import { Plus, Edit, Trash2 } from "lucide-react";

// Dữ liệu giả lập (Mock Data)
const mockBooks = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", status: "Available" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", category: "Education", status: "Out of Stock" },
];

export default function BookManagement() {
  const [activeTab, setActiveTab] = useState("books");
  const tabs = ["books", "authors", "categories", "tags"];

  return (
    <div>
      <TopBar title="Book Management" />

      {/* 1. Tabs Switcher - Sử dụng class .tabs-container đã định nghĩa ở Bước 1 (Global CSS) */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <div 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-item ${activeTab === tab ? "active" : ""}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      {/* 2. Main Content Area */}
      <div className="card" style={{ minHeight: '400px' }}>
        
        {/* Header: Title + Add Button */}
        <div className="section-header">
          <h3 className="section-title">{activeTab} List</h3>
          <button className="btn-primary">
            <Plus size={18} /> Add New
          </button>
        </div>

        {/* Nội dung thay đổi theo Tab */}
        {activeTab === 'books' ? (
          <table className="table-container">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockBooks.map((book) => (
                <tr key={book.id}>
                  <td style={{ fontWeight: 700 }}>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.category}</td>
                  <td>
                    <span className={`status-badge ${book.status === 'Available' ? 'status-success' : 'status-error'}`}>
                      {book.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn icon-edit">
                        <Edit size={18} />
                      </button>
                      <button className="action-btn icon-delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* Placeholder cho các tab chưa làm */
          <div className="empty-state">
            Component for <strong>{activeTab}</strong> is under development...
          </div>
        )}
      </div>
    </div>
  );
}