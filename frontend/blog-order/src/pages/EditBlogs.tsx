import { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { getAllArticles, updateArticle, getInternalLink } from '../services/articlesService';
import type { Article } from '../types/article';

const PAGE_SIZE = 10;

const EditBlogs = () => {
  const [blogs, setBlogs] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getAllArticles();
      setBlogs(data);
    } catch (e) {
      setToast({ type: 'error', message: 'Failed to fetch blogs.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog: Article) => {
    setEditId(blog.id);
    setEditForm({
      title: blog.topic || '',
      content: blog.versions?.find(v => v.id === blog.selected_version_id)?.content_md || '',
      keyword: blog.keyword || '',
      internalLinks: blog.hasOwnProperty('internalLinks') ? (blog as any).internalLinks : false,
      domain_id: blog.domain_id, // Assuming domain_id is part of the blog object
    });
  };

  const handleSave = async () => {
    if (!editId) return;
    try {
      await updateArticle(editId, {
        topic: editForm.title,
        keyword: editForm.keyword,
        // If internalLinks is a field in your backend, include it:
        ...(editForm.internalLinks !== undefined ? { internalLinks: editForm.internalLinks } : {}),
        // Note: content updates may need to be handled separately via version management
      });
      setToast({ type: 'success', message: 'Blog updated successfully!' });
      setEditId(null);
      setEditForm({});
      fetchBlogs();
    } catch (e) {
      setToast({ type: 'error', message: 'Failed to update blog.' });
    }
  };

  const handleCloseToast = () => setToast(null);

  const handleInternalLinksChange = async (checked: boolean) => {
    if (checked && editForm.title && editForm.title.length > 0 && editForm.domain_id) {
      try {
        const { anchorText, targetUrl } = await getInternalLink(editForm.title, editForm.domain_id);
        setEditForm((prev: any) => ({
          ...prev,
          internalLinks: true,
          anchor: anchorText,
          targetURL: targetUrl,
        }));
      } catch (e) {
        setEditForm((prev: any) => ({ ...prev, internalLinks: true }));
      }
    } else if (!checked) {
      setEditForm((prev: any) => ({ ...prev, internalLinks: false }));
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(blogs.length / PAGE_SIZE);
  const paginatedBlogs = blogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-8">
      <div className="glass-card rounded-2xl p-8 dark-gradient-overlay">
        <h1 className="text-3xl font-bold text-foreground mb-2">Edit Blogs</h1>
        <p className="text-muted-foreground">Manage and edit your blog articles</p>
      </div>
      
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
          onClick={handleCloseToast}
        >
          {toast.message}
        </div>
      )}
      {loading ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="text-foreground">Loading blogs...</div>
        </div>
      ) : (
        <>
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {paginatedBlogs.map(blog => (
                    <tr key={blog.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-foreground">
                          {blog.topic || <span className="text-muted-foreground">(No Title)</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">{blog.domain?.name || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-foreground">{new Date(blog.created_at).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                          onClick={() => handleEdit(blog)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center p-6 space-x-2">
                <button
                  className="px-4 py-2 bg-background/50 border border-border rounded-lg disabled:opacity-50 text-foreground hover:bg-muted/30 transition-colors"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </button>
                <span className="text-foreground">Page {page} of {totalPages}</span>
                <button
                  className="px-4 py-2 bg-background/50 border border-border rounded-lg disabled:opacity-50 text-foreground hover:bg-muted/30 transition-colors"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Edit Modal */}
          {editId && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="glass-card rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <h2 className="text-xl font-semibold mb-6 text-foreground">Edit Blog</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Title</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-background/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={editForm.title}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Content</label>
                    <div data-color-mode="light">
                      <MDEditor
                        value={editForm.content}
                        onChange={val => setEditForm({ ...editForm, content: val || '' })}
                        previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                        height={300}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Keyword</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-background/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={editForm.keyword}
                      onChange={e => setEditForm({ ...editForm, keyword: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!!editForm.internalLinks}
                      onChange={e => handleInternalLinksChange(e.target.checked)}
                      id="internalLinks"
                      className="rounded border-border"
                    />
                    <label htmlFor="internalLinks" className="text-sm text-foreground">Internal Links</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Target URL</label>
                    <input
                      type="text"
                      className={`w-full p-3 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        editForm.internalLinks ? 'bg-muted/30 text-muted-foreground cursor-not-allowed' : 'bg-background/50'
                      }`}
                      value={editForm.targetURL || ''}
                      onChange={e => setEditForm({ ...editForm, targetURL: e.target.value })}
                      disabled={!!editForm.internalLinks}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Anchor Text</label>
                    <input
                      type="text"
                      className={`w-full p-3 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        editForm.internalLinks ? 'bg-muted/30 text-muted-foreground cursor-not-allowed' : 'bg-background/50'
                      }`}
                      value={editForm.anchor || ''}
                      onChange={e => setEditForm({ ...editForm, anchor: e.target.value })}
                      disabled={!!editForm.internalLinks}
                      placeholder="Click here to learn more"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-8">
                  <button
                    onClick={() => { setEditId(null); setEditForm({}); }}
                    className="px-6 py-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg transition-all duration-300"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditBlogs; 