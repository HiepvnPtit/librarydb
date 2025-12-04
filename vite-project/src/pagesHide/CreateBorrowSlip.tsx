
 {
  "readerId": 1,
  "bookIds": [
    33
  ],
  "note": "string"
}


              return (
                <tr key={item.id}>
                  <td style={{ fontWeight: 700 }}>{item.user}</td>
                  <td>{item.book}</td>
                  <td>{item.borrowDate}</td>
                  <td>{item.dueDate}</td>
                  <td>
                    <span className={`status-badge ${config.className}`}>
                      {config.icon} {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status !== "Returned" && (
                        <button className="btn-outline-primary">
                            Return Book
                        </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>
              <X size={20} />
            </button>
            
            <div className="modal-header">
              <h2 className="modal-title">Create Borrow Slip</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">ID USER</label>
                <input
                  type="text"
                  name="idUser"
                  className="form-input"
                  value={formData.idUser}
                  onChange={handleInputChange}
                  placeholder="Enter user ID"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">ID BOOK</label>
                <input
                  type="text"
                  name="idBook"
                  className="form-input"
                  value={formData.idBook}
                  onChange={handleInputChange}
                  placeholder="Enter book ID"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">NOTE</label>
                <textarea
                  name="note"
                  className="form-input form-textarea"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Enter notes..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  Submit
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}