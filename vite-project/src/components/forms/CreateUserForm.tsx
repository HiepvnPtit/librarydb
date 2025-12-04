import { useState } from "react";
import { X } from "lucide-react";
import { createUser } from "../../api/apiService";

interface CreateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserForm({ isOpen, onClose, onSuccess }: CreateUserFormProps) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim()) return alert("Username bắt buộc");
    if (!form.password.trim()) return alert("Mật khẩu bắt buộc");
    if (!form.email.trim()) return alert("Email bắt buộc");
    
    setIsSubmitting(true);
    try {
      await createUser(form);
      onSuccess();
      setForm({ username: "", password: "", email: "", phoneNumber: "", birthDate: "" });
      onClose();
    } catch (err) {
      console.error("Create user failed", err);
      alert("Tạo người dùng thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: 500, maxWidth: "95%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Tạo Người Dùng Mới</h3>
          <button className="btn-cancel" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input
              className="form-input"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật Khẩu *</label>
            <input
              type="password"
              className="form-input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Số Điện Thoại</label>
            <input
              className="form-input"
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ngày Sinh</label>
            <input
              type="date"
              className="form-input"
              value={form.birthDate}
              onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo Người Dùng"}
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
