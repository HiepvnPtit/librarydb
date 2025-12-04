import { useState } from "react";
import TopBar from "../components/TopBar";
import { searchItems } from "../service/SearchingItem";
import { Loader2, Plus, Edit, Trash2, Search } from "lucide-react";
import { deleteBook, deleteAuthor, deleteCategory, deleteTag } from "../api/apiService"
import CreateBookForm from "../components/forms/CreateBookForm";
import CreateAuthorForm from "../components/forms/CreateAuthorForm";
import CreateCategoryForm from "../components/forms/CreateCategoryForm";
import CreateTagForm from "../components/forms/CreateTagForm";
import {
  useBookData, useAuthorData, useCategoryData, useTagData
} from '../hooks/useManagementHooks';
import type { Book, Author, Category, Tag } from '../hooks/useManagementHooks';


const getStatusBadge = (book: Book) => {
  if (!book.isActive) return <span className="status-badge badge-gray">Inactive</span>;
  if (book.availableQuantity === 0) return <span className="status-badge badge-danger">Out of Stock</span>;
  if (book.availableQuantity < 10) return <span className="status-badge badge-warning">Low Stock</span>;
  return <span className="status-badge badge-success">Available</span>;
};

export default function BookManagement() {
  const [activeTab, setActiveTab] = useState("books");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const tabs = ["books", "authors", "categories", "tags"];

  // Create modal states for all forms
  const [isCreateBookModalOpen, setIsCreateBookModalOpen] = useState(false);
  const [isCreateAuthorModalOpen, setIsCreateAuthorModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);

  //(loading, refetch tự động)
  const { data: books, loading: loadingBooks, refetch: refetchBooks } = useBookData(activeTab === 'books');
  const { data: authors, loading: loadingAuthors, refetch: refetchAuthors } = useAuthorData(activeTab === 'authors');
  const { data: categories, loading: loadingCategories, refetch: refetchCategories } = useCategoryData(activeTab === 'categories');
  const { data: tags, loading: loadingTags, refetch: refetchTags } = useTagData(activeTab === 'tags');

  //xác định trạng thái loading và data hiện tại
  const loading = loadingBooks || loadingAuthors || loadingCategories || loadingTags || isSearching;

  let currentData: any[] = [];
  // Nếu có kết quả tìm kiếm thì sử dụng nó, nếu không sử dụng data gốc
  if (activeTab === 'books') currentData = searchResults !== null ? searchResults : (books as Book[]);
  else if (activeTab === 'authors') currentData = searchResults !== null ? searchResults : (authors as Author[]);
  else if (activeTab === 'categories') currentData = searchResults !== null ? searchResults : (categories as Category[]);
  else if (activeTab === 'tags') currentData = searchResults !== null ? searchResults : (tags as Tag[]);

  //nuts them
  const handleAddNew = () => {
    if (activeTab === 'books') {
      setIsCreateBookModalOpen(true);
    } else if (activeTab === 'authors') {
      setIsCreateAuthorModalOpen(true);
    } else if (activeTab === 'categories') {
      setIsCreateCategoryModalOpen(true);
    } else if (activeTab === 'tags') {
      setIsCreateTagModalOpen(true);
    }
  };

  const handleCreateSuccess = () => {
    if (activeTab === 'books') refetchBooks && refetchBooks();
    else if (activeTab === 'authors') refetchAuthors && refetchAuthors();
    else if (activeTab === 'categories') refetchCategories && refetchCategories();
    else if (activeTab === 'tags') refetchTags && refetchTags();
  };

  //xử lý tìm kiếm (delegated to searchItems service)
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchItems(query, activeTab, { authors, categories, tags });
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };


  // xoas

  const handleDelete = (id: number) => {
    return (window.confirm(`Are you sure you want to delete ${activeTab} with ID: ${id}?`))
  };

  // xoá các phần tử khi chọn nút khác
  const renderTableBody = () => {
    if (currentData.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="empty-state">No {activeTab} found.</td>
        </tr>
      );
    }

    // bôk
    if (activeTab === 'books') {
      return (currentData as Book[]).map((book) => (


        <tr key={book.id}>
          <td>
            <div style={{ color: '#0040ffff', fontWeight: 7 }}>{book.id}</div>
            <div style={{ fontSize: '12px', color: '#A3AED0' }}>{book.bookCode}</div>
          </td>
          <td>

            <div style={{ fontWeight: 700 }}>{book.title}</div>

          </td>

          <td><div style={{ color: '#006796ff', fontWeight: 7, }}>ID{book.authors[0].id} {book.authors.map((a: { authorName: string }) => a.authorName).join(", ")}</div></td>
          <td>ID{book.category.id} {book.category?.categoryName}</td>
          <td><span className={`stock-info ${book.availableQuantity < 10 ? 'stock-low' : ''}`}>{book.availableQuantity} / {book.totalQuantity}</span></td>
          <td>{getStatusBadge(book)}</td>
          <td>
            <div className="table-actions">
              <button className="action-btn icon-edit" title="Edit"><Edit size={18} /></button>
              <button className="action-btn icon-delete" title="Delete" onClick={() => { if (handleDelete(book.id)) { deleteBook(book.id) } }}><Trash2 size={18} /></button>
            </div>
          </td>
        </tr>
      ));
    }


    // tac gia
    if (activeTab === 'authors') {
      return (currentData as Author[]).map((author) => (
        <tr key={author.id}>
          <td>{author.id}</td>
          <td style={{ fontWeight: 700 }}>{author.authorName}</td>
          <td>{author.biography.substring(0, 50)}...</td>
          <td><div className="table-actions">
            <button className="action-btn icon-edit" title="Edit"><Edit size={18} /></button>
            <button className="action-btn icon-delete" title="Delete" onClick={() => { if (handleDelete(author.id)) { deleteAuthor(author.id) } }}><Trash2 size={18} /></button>
          </div></td>
        </tr>
      ));
    }

    if (activeTab === 'categories') {
      return (currentData as Category[]).map((category) => (
        <tr key={category.id}>
          <td>{category.id}</td>
          <td style={{ fontWeight: 700 }}>{category.categoryName}</td>
          <td>{category.description.substring(0, 50)}...</td>
          <td><div className="table-actions">
            <button className="action-btn icon-edit" title="Edit"><Edit size={18} /></button>
            <button className="action-btn icon-delete" title="Delete" onClick={() => { if (handleDelete(category.id)) { deleteCategory(category.id) } }}><Trash2 size={18} /></button>
          </div></td>
        </tr>
      ));
    }
    if (activeTab === 'tags') {
      return (currentData as Tag[]).map((tag) => (
        <tr key={tag.id}>
          <td>{tag.id}</td>
          <td style={{ fontWeight: 700 }}>{tag.tagName}</td>
          <td>{tag.description.substring(0, 50)}...</td>
          <td><div className="table-actions">
            <button className="action-btn icon-edit" title="Edit"><Edit size={18} /></button>
            <button className="action-btn icon-delete" title="Delete" onClick={() => { if (handleDelete(tag.id)) { deleteTag(tag.id) } }}><Trash2 size={18} /></button>
          </div></td>
        </tr>
      ));
    }
    return null;
  };


  return (
    <div>
      <TopBar title="Book Management" />


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

      <div className="card" style={{ minHeight: '400px', padding: "20px" }}>

        <div className="section-header" style={{ padding: '24px 24px 0 24px' }}>

          <h3 className="section-title">{activeTab} List</h3>

          <button className="btn-primary" onClick={handleAddNew}>
            <Plus size={18} /> Add New
          </button>

        </div>
        <div className="search-wrapper"  style={{marginBottom: 30}}>
          <Search size={18} color="#A3AED0"  />
          <input 
            placeholder="Search by user or book..."
            className="search-input-field"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={activeTab !== 'books' && activeTab !== 'authors' && activeTab !== 'categories' && activeTab !== 'tags'}
           
          />
        </div>

        {/* Create Form Components */}
        <CreateBookForm
          isOpen={isCreateBookModalOpen}
          onClose={() => setIsCreateBookModalOpen(false)}
          onSuccess={handleCreateSuccess}
          authors={authors || []}
          categories={categories || []}
          tags={tags || []}
          onRefetchAuthors={refetchAuthors}
          onRefetchCategories={refetchCategories}
          onRefetchTags={refetchTags}
        />

        <CreateAuthorForm
          isOpen={isCreateAuthorModalOpen}
          onClose={() => setIsCreateAuthorModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />

        <CreateCategoryForm
          isOpen={isCreateCategoryModalOpen}
          onClose={() => setIsCreateCategoryModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />

        <CreateTagForm
          isOpen={isCreateTagModalOpen}
          onClose={() => setIsCreateTagModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />

        {loading && (
          <div className="empty-state">
            <Loader2 className="animate-spin" size={30} />
            <p>Loading {activeTab} data...</p>
          </div>
        )}



        {!loading && (
          <table className="table-container">
            <thead>

              {activeTab === 'books' && (
                <tr>
                  <th style={{ width: '8%' }}>ID / Code</th><th style={{ width: '20%' }}>Title </th><th>Author</th><th>Category</th><th>Stock</th><th>Status</th><th>Action</th>

                </tr>
              )}
              {activeTab === 'authors' && (
                <tr>
                  <th style={{ width: '10%' }}>ID</th><th>Author Name</th><th>Biography</th><th style={{ width: '15%' }}>Action</th>
                </tr>
              )}
              {activeTab === 'categories' && (
                <tr>
                  <th>ID</th><th>Category Name</th><th>Description</th><th style={{ width: '15%' }}>Action</th>
                </tr>
              )}
              {activeTab === 'tags' && (
                <tr>
                  <th>ID</th><th>Tag Name</th><th>Description</th><th style={{ width: '15%' }}>Action</th>
                </tr>
              )}
            </thead>
            <tbody>
              {renderTableBody()}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}