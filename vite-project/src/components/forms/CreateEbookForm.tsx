import { useState } from "react";
import { X } from "lucide-react";
import { createEbookPage } from "../../api/apiService";
import type { Book } from "../../hooks/useManagementHooks";

interface CreateEbookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  books?: Book[];
}

export default function CreateEbookForm({ isOpen, onClose, onSuccess, books = [] }: CreateEbookFormProps) {
  const [form, setForm] = useState({
    bookId: 0,
    pageNumber: 1,
    imageUrl: "",
    contentText: "",
    width: 0,
    height: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bookId) return alert("Vui lòng chọn sách");
    if (!form.imageUrl.trim()) return alert("URL hình ảnh bắt buộc");
    
    setIsSubmitting(true);
    try {
      await createEbookPage(form);
      onSuccess();
      setForm({ bookId: 0, pageNumber: 1, imageUrl: "", contentText: "", width: 0, height: 0 });
      onClose();
    } catch (err) {
      console.error("Create ebook page failed", err);
      alert("Tạo trang eBook thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: 600, maxWidth: "95%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Tạo Trang eBook Mới</h3>
          <button className="btn-cancel" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Sách *</label>
            <select
              className="form-input"
              value={form.bookId}
              onChange={(e) => setForm({ ...form, bookId: parseInt(e.target.value) })}
              required
            >
              <option value="">-- Chọn sách --</option>
              {books.map(b => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Số Trang *</label>
              <input
                type="number"
                className="form-input"
                value={form.pageNumber}
                onChange={(e) => setForm({ ...form, pageNumber: parseInt(e.target.value || "0") })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chiều Rộng</label>
              <input
                type="number"
                className="form-input"
                value={form.width}
                onChange={(e) => setForm({ ...form, width: parseInt(e.target.value || "0") })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chiều Cao</label>
              <input
                type="number"
                className="form-input"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: parseInt(e.target.value || "0") })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">URL Hình Ảnh *</label>
            <input
              className="form-input"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nội Dung Văn Bản</label>
            <textarea
              className="form-input form-textarea"
              value={form.contentText}
              onChange={(e) => setForm({ ...form, contentText: e.target.value })}
              rows={4}
            />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo Trang eBook"}
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
