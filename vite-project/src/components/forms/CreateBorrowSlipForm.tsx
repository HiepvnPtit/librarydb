import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createBorrowSlip, getAllUsers, getAllBooks } from "../../api/apiService";
import type { Book, User } from "../../hooks/useManagementHooks";

interface CreateBorrowSlipFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  users?: User[];
  books?: Book[];
}

export default function CreateBorrowSlipForm({ isOpen, onClose, onSuccess, users = [], books = [] }: CreateBorrowSlipFormProps) {
  const [form, setForm] = useState({
    readerId: 0,
    bookIds: [] as number[],
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  // Local state to fetch and cache all items
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [localBooks, setLocalBooks] = useState<Book[]>([]);

  // Fetch all data when modal opens
  useEffect(() => {
    if (isOpen && localUsers.length === 0) {
      Promise.all([
        getAllUsers(),
        getAllBooks()
      ])
        .then(([usersRes, booksRes]: any) => {
          setLocalUsers(usersRes?.data || usersRes || []);
          setLocalBooks(booksRes?.data || booksRes || []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          // Fall back to props data
          setLocalUsers(users || []);
          setLocalBooks(books || []);
        });
    }
  }, [isOpen]);

  // Filter functions for suggestions
  const filteredUsers = (localUsers || []).filter((u) =>
    userSearch === "" ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.id.toString().includes(userSearch)
  );

  const filteredBooks = (localBooks || []).filter((b) =>
    bookSearch === "" ||
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.id.toString().includes(bookSearch)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.readerId) return alert("Vui lòng chọn bạn đọc");
    if (!form.bookIds.length) return alert("Vui lòng chọn ít nhất 1 cuốn sách");
    
    setIsSubmitting(true);
    try {
      console.log("Sending borrow slip data:", form);
      const response = await createBorrowSlip(form);
      console.log("BorrowSlip API Response:", response);
      
      // Check if response has valid data
      if (!response || (response.data && response.data.id === 0)) {
        console.warn("Warning: Response may not contain valid ID", response);
      }
      
      onSuccess();
      setForm({ readerId: 0, bookIds: [], note: "" });
      setUserSearch("");
      setBookSearch("");
      onClose();
      alert("Tạo phiếu mượn thành công!");
    } catch (err) {
      console.error("Create borrow slip failed:", err);
      alert("Tạo phiếu mượn thất bại. Vui lòng kiểm tra lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleBook = (bookId: number) => {
    setForm(prev => ({
      ...prev,
      bookIds: prev.bookIds.includes(bookId)
        ? prev.bookIds.filter(id => id !== bookId)
        : [...prev.bookIds, bookId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: 600, maxWidth: "95%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Tạo Phiếu Mượn Mới</h3>
          <button className="btn-cancel" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Bạn Đọc *</label>
            <input
              className="form-input"
              placeholder="Tìm bạn đọc theo tên, email hoặc ID..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onFocus={() => setUserSearch("")}
              style={{ marginBottom: 8 }}
            />
            {userSearch !== null && (filteredUsers.length > 0 || users?.length === 0) && (
              <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", borderRadius: 4, marginBottom: 8, backgroundColor: "#fff" }}>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      style={{
                        padding: "10px 12px",
                        cursor: "pointer",
                        backgroundColor: form.readerId === u.id ? "#c8e6c9" : "transparent",
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                      onClick={() => {
                        setForm({ ...form, readerId: u.id });
                        setUserSearch("");
                      }}
                    >
                      <div>
                        <strong>ID{u.id}</strong> - {u.username} ({u.email})
                      </div>
                      {form.readerId === u.id && <span style={{ color: "#4CAF50", fontWeight: "bold" }}>✓</span>}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "10px 12px", color: "#999", textAlign: "center" }}>
                    Không tìm thấy bạn đọc
                  </div>
                )}
              </div>
            )}
            {form.readerId > 0 && (
              <div style={{ marginBottom: 8, padding: 8, backgroundColor: "#f0f0f0", borderRadius: 4 }}>
                ✓ Đã chọn: ID{form.readerId} - {localUsers?.find(u => u.id === form.readerId)?.username || users?.find(u => u.id === form.readerId)?.username} ({localUsers?.find(u => u.id === form.readerId)?.email || users?.find(u => u.id === form.readerId)?.email})
                <button
                  type="button"
                  style={{
                    marginLeft: 8,
                    padding: "2px 6px",
                    backgroundColor: "#ff6b6b",
                    color: "#fff",
                    border: "none",
                    borderRadius: 3,
                    cursor: "pointer",
                    fontSize: 12
                  }}
                  onClick={() => setForm({ ...form, readerId: 0 })}
                >
                  Xoá
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Sách Mượn *</label>
            <input
              className="form-input"
              placeholder="Tìm sách theo tên hoặc ID..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <div style={{ border: "1px solid #ddd", borderRadius: 4, padding: 8, maxHeight: 200, overflowY: "auto" }}>
              {filteredBooks.length === 0 ? (
                <p style={{ color: "#999", textAlign: "center" }}>Không có sách</p>
              ) : (
                filteredBooks.map(b => (
                  <label key={b.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: 6, cursor: "pointer", borderBottom: "1px solid #eee" }}>
                    <input
                      type="checkbox"
                      checked={form.bookIds.includes(b.id)}
                      onChange={() => toggleBook(b.id)}
                    />
                    <span><strong>ID{b.id}</strong> - {b.title}</span>
                  </label>
                ))
              )}
            </div>
            {form.bookIds.length > 0 && (
              <div style={{ marginTop: 8, padding: 8, backgroundColor: "#f0f0f0", borderRadius: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>✓ Đã chọn ({form.bookIds.length}):</div>
                {form.bookIds.map(id => {
                  const book = localBooks?.find(b => b.id === id) || books?.find(b => b.id === id);
                  return (
                    <div key={id} style={{ fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span>• ID{id} - {book?.title}</span>
                      <button
                        type="button"
                        style={{
                          padding: "2px 6px",
                          backgroundColor: "#ff6b6b",
                          color: "#fff",
                          border: "none",
                          borderRadius: 3,
                          cursor: "pointer",
                          fontSize: 10
                        }}
                        onClick={() => toggleBook(id)}
                      >
                        Xoá
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Ghi Chú</label>
            <textarea
              className="form-input form-textarea"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={4}
            />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo Phiếu Mượn"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
