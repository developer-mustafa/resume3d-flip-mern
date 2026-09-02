import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../../api/client';
import useToastStore from '../../stores/toastStore';
import { LoadingState, EmptyState, StatusBadge } from '../ui/States';
import ConfirmDialog from '../ui/ConfirmDialog';
import { Mail, Trash2, Eye, Archive, Clock } from 'lucide-react';

export default function ContactManager() {
  const [messages, setMessages] = useState([]);
  const [counts, setCounts] = useState({ unread: 0, read: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToastStore();

  const fetchMessages = useCallback(async () => {
    try {
      const params = {};
      if (filter) params.status = filter;
      const { data } = await adminAPI.getMessages(params);
      setMessages(data.items || []);
      setCounts(data.counts || { unread: 0, read: 0, archived: 0 });
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const updateStatus = async (id, status) => {
    try {
      await adminAPI.updateMessageStatus(id, status);
      toast.success(`Message marked as ${status}`);
      fetchMessages();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminAPI.deleteMessage(deleteTarget);
      toast.success('Message deleted');
      setDeleteTarget(null);
      if (selected?._id === deleteTarget) setSelected(null);
      fetchMessages();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ivory">Contact Messages</h1>
        <p className="text-sm text-muted-light mt-1">Manage form submissions</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: '', label: 'All' },
          { key: 'unread', label: `Unread (${counts.unread})` },
          { key: 'read', label: `Read (${counts.read})` },
          { key: 'archived', label: `Archived (${counts.archived})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              filter === tab.key ? 'bg-accent/10 text-accent' : 'text-muted-light hover:text-ivory hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Message list */}
        <div className="bg-charcoal-light border border-border-dark rounded-xl overflow-hidden">
          {messages.length > 0 ? (
            <div className="divide-y divide-border-dark max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => {
                    setSelected(msg);
                    if (msg.status === 'unread') updateStatus(msg._id, 'read');
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors hover:bg-white/[0.02] ${
                    selected?._id === msg._id ? 'bg-accent/5' : ''
                  } ${msg.status === 'unread' ? 'border-l-2 border-l-accent' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${msg.status === 'unread' ? 'font-semibold text-ivory' : 'text-muted-light'}`}>
                      {msg.name}
                    </span>
                    <StatusBadge status={msg.status} />
                  </div>
                  <p className="text-xs text-muted truncate">{msg.subject || msg.message}</p>
                  <p className="text-[10px] text-muted font-mono mt-1">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState title="No messages" message="Contact form submissions will appear here." />
          )}
        </div>

        {/* Message detail */}
        <div className="bg-charcoal-light border border-border-dark rounded-xl p-5">
          {selected ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-ivory">{selected.name}</h3>
                <div className="flex gap-1">
                  <button onClick={() => updateStatus(selected._id, 'read')} title="Mark as read"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-light hover:text-ivory hover:bg-white/5">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateStatus(selected._id, 'archived')} title="Archive"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-light hover:text-accent hover:bg-accent/10">
                    <Archive className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(selected._id)} title="Delete"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-light hover:text-red-400 hover:bg-red-500/5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-light">
                  <Mail className="w-3.5 h-3.5" />
                  <a href={`mailto:${selected.email}`} className="hover:text-accent">{selected.email}</a>
                </div>
                {selected.subject && (
                  <p className="text-muted-light"><strong className="text-ivory">Subject:</strong> {selected.subject}</p>
                )}
                <div className="flex items-center gap-2 text-[10px] text-muted font-mono">
                  <Clock className="w-3 h-3" />
                  {new Date(selected.createdAt).toLocaleString()}
                </div>
                <div className="mt-4 p-4 bg-charcoal rounded-lg">
                  <p className="text-ivory whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-light text-sm">
              Select a message to view
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete message?"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
