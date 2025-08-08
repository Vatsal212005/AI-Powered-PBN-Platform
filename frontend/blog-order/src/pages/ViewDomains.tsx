import { useState, useEffect } from 'react';
import { 
  getAllDomains, 
  updateDomain, 
  deleteDomain, 
  getAvailableTemplates, 
  switchDomainTemplate,
  createDomainFolder,
  buildDomain,
  getDomainStatus,
  downloadDomain
} from '../services/domainService';
import type { Domain } from '../types/domain';

const ViewDomains = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [templates, setTemplates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDomain, setEditingDomain] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Domain>>({});
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');
  const [statuses, setStatuses] = useState<Record<string, any>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [domainsRes, templatesRes] = await Promise.all([
        getAllDomains(),
        getAvailableTemplates()
      ]);
      setDomains(domainsRes.domains);
      setTemplates(templatesRes.templates);
      
      // Load domain statuses
      const statusPromises = domainsRes.domains.map(async (domain) => {
        try {
          const status = await getDomainStatus(domain.slug);
          return { [domain.slug]: status.status };
        } catch (error) {
          return { [domain.slug]: null };
        }
      });
      const statusResults = await Promise.all(statusPromises);
      const statusMap = statusResults.reduce((acc, status) => ({ ...acc, ...status }), {} as Record<string, any>);
      setStatuses(statusMap);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (domain: Domain) => {
    setEditingDomain(domain.id);
    setEditForm({
      name: domain.name,
      slug: domain.slug,
      url: domain.url,
      tags: domain.tags
    });
  };

  const handleSave = async (id: string) => {
    try {
      await updateDomain(id, editForm);
      setDomains(domains.map(d => d.id === id ? { ...d, ...editForm } : d));
      setEditingDomain(null);
      setEditForm({});
    } catch (error) {
      console.error('Failed to update domain:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this domain?')) return;
    try {
      await deleteDomain(id);
      setDomains(domains.filter(d => d.id !== id));
    } catch (error) {
      console.error('Failed to delete domain:', error);
    }
  };

  const handleSwitchTemplate = async (domainName: string, newTemplate: string) => {
    try {
      await switchDomainTemplate(domainName, newTemplate);
      alert(`Template switched to ${newTemplate} for ${domainName}`);
      loadData(); // Reload to get updated status
    } catch (error) {
      console.error('Failed to switch template:', error);
      alert('Failed to switch template');
    }
  };

  const handleCreateFolder = async () => {
    if (!newDomainName.trim()) return;
    try {
      await createDomainFolder(newDomainName);
      alert(`Domain folder created for ${newDomainName}`);
      setShowCreateFolder(false);
      setNewDomainName('');
      loadData();
    } catch (error) {
      console.error('Failed to create domain folder:', error);
      alert('Failed to create domain folder');
    }
  };

  const handleBuildDomain = async (domainName: string) => {
    try {
      await buildDomain(domainName);
      alert(`Domain ${domainName} built successfully!`);
      loadData(); // Reload to get updated status
    } catch (error) {
      console.error('Failed to build domain:', error);
      alert('Failed to build domain');
    }
  };

  const handleDownloadDomain = async (domainName: string) => {
    try {
      const blob = await downloadDomain(domainName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${domainName}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download domain:', error);
      alert('Failed to download domain');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="glass-card rounded-2xl p-8 dark-gradient-overlay">
          <div className="text-center text-foreground">Loading domains...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="glass-card rounded-2xl p-8 dark-gradient-overlay">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Manage Domains</h1>
            <p className="text-muted-foreground">Configure and monitor your blog domains</p>
          </div>
          <button
            onClick={() => setShowCreateFolder(true)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300"
          >
            Create Domain Folder
          </button>
        </div>
      </div>

      {/* Create Domain Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card rounded-2xl p-8 w-96 shadow-2xl">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Create Domain Folder</h3>
            <input
              type="text"
              placeholder="Domain name"
              value={newDomainName}
              onChange={(e) => setNewDomainName(e.target.value)}
              className="w-full p-3 bg-background/50 border border-border rounded-xl mb-4 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateFolder(false)}
                className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-xl font-medium shadow-lg transition-all duration-300"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Domains Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {domains.map((domain) => (
                <tr key={domain.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingDomain === domain.id ? (
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full p-2 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {domain.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {domain.slug}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingDomain === domain.id ? (
                      <input
                        type="text"
                        value={editForm.url || ''}
                        onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                        className="w-full p-2 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <div className="text-sm text-foreground">
                        {domain.url || '-'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingDomain === domain.id ? (
                      <input
                        type="text"
                        value={editForm.tags || ''}
                        onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                        className="w-full p-2 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    ) : (
                      <div className="text-sm text-foreground">
                        {domain.tags || '-'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {statuses[domain.slug] ? (
                        <div>
                          <div className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                            statuses[domain.slug].exists 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {statuses[domain.slug].exists ? 'Active' : 'Inactive'}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {statuses[domain.slug].postCount || 0} posts
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Unknown</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={statuses[domain.slug]?.layout || 'default'}
                      onChange={(e) => handleSwitchTemplate(domain.slug, e.target.value)}
                      className="text-sm bg-background/50 border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {templates.map((template) => (
                        <option key={template} value={template}>
                          {template}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      {editingDomain === domain.id ? (
                        <>
                          <button
                            onClick={() => handleSave(domain.id)}
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingDomain(null);
                              setEditForm({});
                            }}
                            className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(domain)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleBuildDomain(domain.slug)}
                            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors"
                          >
                            Build
                          </button>
                          <button
                            onClick={() => handleDownloadDomain(domain.slug)}
                            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
                            title="Download as ZIP"
                          >
                            📥
                          </button>
                          <button
                            onClick={() => handleDelete(domain.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {domains.length === 0 && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-muted-foreground text-lg">
            No domains found. Create your first domain to get started.
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDomains; 