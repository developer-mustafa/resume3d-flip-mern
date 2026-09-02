import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/client';
import useToastStore from '../../stores/toastStore';
import { LoadingState, EmptyState } from '../ui/States';
import ConfirmDialog from '../ui/ConfirmDialog';
import { Upload, Trash2, Image, FileText, Loader2 } from 'lucide-react';

export default function MediaManager() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const toast = useToastStore();

  const fetchFiles = async () => {
    try {
      const { data } = await adminAPI.getMedia();
      setFiles(data || []);
    } catch (err) {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await adminAPI.uploadMedia(formData);
      toast.success('File uploaded');
      fetchFiles();
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminAPI.deleteMedia(deleteTarget);
      toast.success('File deleted');
      setDeleteTarget(null);
      fetchFiles();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isImage = (filename) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(filename);

  if (loading) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ivory">Media</h1>
          <p className="text-sm text-muted-light mt-1">Manage uploaded files</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload
          <input type="file" accept="image/*,.pdf" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {files.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {files.map((file) => (
            <div key={file.filename} className="bg-charcoal-light border border-border-dark rounded-xl overflow-hidden group">
              <div className="aspect-square bg-charcoal flex items-center justify-center relative">
                {isImage(file.filename) ? (
                  <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-10 h-10 text-muted" />
                )}
                <button
                  onClick={() => setDeleteTarget(file.filename)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-lg bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs text-ivory truncate">{file.filename}</p>
                <p className="text-[10px] text-muted mt-0.5">{formatSize(file.size)}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(file.url);
                    toast.info('URL copied');
                  }}
                  className="text-[10px] text-accent hover:underline mt-1"
                >
                  Copy URL
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Image className="w-12 h-12 text-muted" />}
          title="No media uploaded"
          message="Upload images and files to use in your resume."
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete file?"
        message="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
