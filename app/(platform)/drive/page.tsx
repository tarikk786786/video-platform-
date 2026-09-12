'use client';

import { useState, useMemo } from 'react';
import {
  MOCK_DRIVE_FILES,
  MOCK_DRIVE_FOLDERS,
  MOCK_STORAGE_QUOTA,
  DriveFile,
  DriveFolder,
} from '@/lib/mock-data';
import { UniversalFilePreview } from '@/components/drive/universal-file-preview';
import { ChunkedUploader } from '@/components/drive/chunked-uploader';
import { PublishToSocialModal } from '@/components/drive/publish-to-social-modal';
import {
  HardDrive,
  Folder,
  FolderPlus,
  UploadCloud,
  Grid,
  List,
  Search,
  Star,
  Trash2,
  Clock,
  Share2,
  Users,
  Copy,
  Check,
  Download,
  Eye,
  Sparkles,
  Play,
  FileText,
  Code,
  Archive,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function PersonalCloudDrivePage() {
  const [currentNav, setCurrentNav] = useState<
    'my-drive' | 'recent' | 'starred' | 'shared-with-me' | 'shared-by-me' | 'trash' | 'large' | 'duplicates'
  >('my-drive');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('date');

  const [folders, setFolders] = useState<DriveFolder[]>(MOCK_DRIVE_FOLDERS);
  const [files, setFiles] = useState<DriveFile[]>(MOCK_DRIVE_FILES);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());

  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [socialPublishFile, setSocialPublishFile] = useState<DriveFile | null>(null);
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [shareModalFile, setShareModalFile] = useState<DriveFile | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder: DriveFolder = {
      id: `f-${Date.now()}`,
      name: newFolderName.trim(),
      parentId: currentFolderId,
      color: '#6366f1',
      isStarred: false,
      itemCount: 0,
      sizeBytes: 0,
      updatedAt: 'Just now',
    };

    setFolders((prev) => [newFolder, ...prev]);
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const toggleSelectFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isStarred: !f.isStarred } : f))
    );
  };

  const handleTrashSelected = () => {
    setFiles((prev) =>
      prev.map((f) => (selectedFileIds.has(f.id) ? { ...f, isTrashed: true } : f))
    );
    setSelectedFileIds(new Set());
  };
  const displayedFiles = useMemo(() => {
    return files.filter((f) => {
      if (currentNav === 'trash') return f.isTrashed;
      if (f.isTrashed) return false;
      if (currentNav === 'starred' && !f.isStarred) return false;
      if (currentNav === 'large' && f.sizeBytes < 100 * 1024 * 1024) return false;
      if (currentNav === 'my-drive' && currentFolderId !== null && f.folderId !== currentFolderId) return false;
      if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
      if (
        searchQuery &&
        !f.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !f.extension.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.sizeBytes - a.sizeBytes;
      return 0;
    });
  }, [files, currentNav, currentFolderId, categoryFilter, searchQuery, sortBy]);

  const displayedFolders = useMemo(() => {
    if (currentNav !== 'my-drive') return [];
    return folders.filter((f) => {
      if (currentFolderId === null) return f.parentId === null;
      return f.parentId === currentFolderId;
    });
  }, [folders, currentNav, currentFolderId]);

  const currentFolder = folders.find((f) => f.id === currentFolderId);

  const formatSize = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return bytes + ' B';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto pb-16 min-h-[85vh]">
      {/* Left Sidebar */}
      <aside className="w-full lg:w-64 shrink-0 space-y-6">
        <div className="space-y-2">
          <button
            onClick={() => setUploaderOpen(true)}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-lg shadow-primary/25 hover:opacity-95 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Files</span>
          </button>
          <button
            onClick={() => setIsCreatingFolder(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-secondary/80 hover:bg-secondary text-foreground font-semibold text-xs border border-border/60 transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-primary" />
            <span>New Folder</span>
          </button>
        </div>

        <nav className="rounded-3xl bg-card border border-border/50 p-2.5 space-y-1">
          {[
            { id: 'my-drive', label: 'My Drive', icon: HardDrive },
            { id: 'recent', label: 'Recent', icon: Clock },
            { id: 'starred', label: 'Starred', icon: Star },
            { id: 'shared-with-me', label: 'Shared with Me', icon: Users },
            { id: 'shared-by-me', label: 'Shared by Me', icon: Share2 },
            { id: 'large', label: 'Large Files (>100MB)', icon: Layers },
            { id: 'trash', label: 'Trash', icon: Trash2 },
          ].map((nav) => {
            const Icon = nav.icon;
            const isActive = currentNav === nav.id;
            return (
              <button
                key={nav.id}
                onClick={() => {
                  setCurrentNav(nav.id as any);
                  if (nav.id !== 'my-drive') setCurrentFolderId(null);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{nav.label}</span>
              </button>
            );
          })}
        </nav>

        {/* 1TB Storage Quota Widget */}
        <div className="rounded-3xl bg-card border border-border/50 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-primary" />
              <span>Storage Quota</span>
            </span>
            <span className="text-[11px] font-mono text-muted-foreground">
              {(MOCK_STORAGE_QUOTA.usedBytes / 1073741824).toFixed(1)} GB / 1024 GB
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-secondary/80 flex overflow-hidden">
            <div
              style={{ width: `${(MOCK_STORAGE_QUOTA.videoBytes / MOCK_STORAGE_QUOTA.totalBytes) * 100 * 8}%` }}
              className="bg-rose-500 h-full"
              title="Videos"
            />
            <div
              style={{ width: `${(MOCK_STORAGE_QUOTA.photoBytes / MOCK_STORAGE_QUOTA.totalBytes) * 100 * 8}%` }}
              className="bg-blue-500 h-full"
              title="Photos"
            />
            <div
              style={{ width: `${(MOCK_STORAGE_QUOTA.audioBytes / MOCK_STORAGE_QUOTA.totalBytes) * 100 * 8}%` }}
              className="bg-purple-500 h-full"
              title="Audio"
            />
            <div
              style={{ width: `${(MOCK_STORAGE_QUOTA.docBytes / MOCK_STORAGE_QUOTA.totalBytes) * 100 * 8}%` }}
              className="bg-emerald-500 h-full"
              title="Documents"
            />
            <div
              style={{ width: `${(MOCK_STORAGE_QUOTA.archiveBytes / MOCK_STORAGE_QUOTA.totalBytes) * 100 * 8}%` }}
              className="bg-amber-500 h-full"
              title="Archives"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Videos (52 GB)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Photos (18 GB)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Audio (7.4 GB)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Docs (2.8 GB)</span>
            </span>
          </div>

          <div className="pt-2 border-t border-border/40 text-[11px] text-center text-muted-foreground">
            <span>SeaweedFS + Telegram Storage Engine</span>
          </div>
        </div>
      </aside>
      {/* Main Workspace */}
      <main className="flex-1 min-w-0 space-y-6">
        {/* Search & Mode Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-card border border-border/50 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground min-w-0">
            <button
              onClick={() => setCurrentFolderId(null)}
              className="font-bold text-foreground hover:text-primary transition-colors shrink-0"
            >
              My Drive
            </button>
            {currentFolder && (
              <>
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <span className="font-semibold text-primary truncate">{currentFolder.name}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drive files..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-secondary/50 border border-border/50 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-secondary/50 border border-border/50 text-xs text-muted-foreground focus:outline-none"
            >
              <option value="date">Sort: Date</option>
              <option value="name">Sort: Name</option>
              <option value="size">Sort: Size</option>
            </select>

            <div className="flex items-center bg-secondary/40 p-1 rounded-xl border border-border/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'video', label: 'Videos' },
            { id: 'photo', label: 'Photos' },
            { id: 'audio', label: 'Audio' },
            { id: 'document', label: 'Documents' },
            { id: 'code', label: 'Code' },
            { id: 'archive', label: 'Archives' },
            { id: 'binary', label: 'Binaries' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all border ${
                categoryFilter === cat.id
                  ? 'bg-foreground text-background font-semibold border-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground border-border/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Multi-Select Bar */}
        {selectedFileIds.size > 0 && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-primary text-primary-foreground shadow-xl animate-in slide-in-from-bottom-2 text-xs">
            <span className="font-bold pl-2">{selectedFileIds.size} files selected</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTrashSelected}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Move to Trash</span>
              </button>
              <button
                onClick={() => setSelectedFileIds(new Set())}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
              >
                Deselect All
              </button>
            </div>
          </div>
        )}

        {/* New Folder Form */}
        {isCreatingFolder && (
          <form
            onSubmit={handleCreateFolder}
            className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-primary/40 shadow-md"
          >
            <FolderPlus className="w-5 h-5 text-primary shrink-0" />
            <input
              type="text"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name (e.g. Vacation 2026, Source Code)..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/60 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreatingFolder(false)}
              className="px-3 py-1.5 rounded-xl bg-secondary text-xs text-muted-foreground"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Folders List */}
        {displayedFolders.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Folders ({displayedFolders.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
              {displayedFolders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setCurrentFolderId(folder.id)}
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-card border border-border/50 hover:border-primary/50 cursor-pointer transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: `${folder.color || '#6366f1'}20`, color: folder.color || '#6366f1' }}
                    >
                      <Folder className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-foreground truncate block group-hover:text-primary transition-colors">
                        {folder.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {folder.itemCount} items
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files Grid / List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Files ({displayedFiles.length})
          </h2>

          {displayedFiles.length === 0 ? (
            <div className="p-16 text-center rounded-3xl bg-card border border-border/40 space-y-3">
              <HardDrive className="w-10 h-10 text-muted-foreground mx-auto stroke-1" />
              <h3 className="font-bold text-foreground text-sm">No files in this view</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Drag and drop files here or click "Upload Files" to store assets in your personal cloud.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {displayedFiles.map((file) => {
                const isSelected = selectedFileIds.has(file.id);
                return (
                  <div
                    key={file.id}
                    onClick={() => setPreviewFile(file)}
                    className={`group rounded-3xl bg-card border transition-all overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-lg ${
                      isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border/50 hover:border-primary/40'
                    }`}
                  >
                    <div className="relative h-40 bg-secondary/60 flex items-center justify-center overflow-hidden">
                      {file.thumbnailUrl ? (
                        <img
                          src={file.thumbnailUrl}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-primary/70">
                          {file.category === 'video' && <Play className="w-12 h-12" />}
                          {file.category === 'audio' && <HardDrive className="w-12 h-12" />}
                          {file.category === 'document' && <FileText className="w-12 h-12" />}
                          {file.category === 'code' && <Code className="w-12 h-12" />}
                          {file.category === 'archive' && <Archive className="w-12 h-12" />}
                          {file.category === 'binary' && <HardDrive className="w-12 h-12" />}
                        </div>
                      )}

                      <button
                        onClick={(e) => toggleSelectFile(file.id, e)}
                        className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isSelected ? 'bg-primary border-primary text-primary-foreground' : 'bg-black/40 border-white/40 text-transparent hover:border-white'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                      </button>

                      <button
                        onClick={(e) => toggleStar(file.id, e)}
                        className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-black/40 backdrop-blur-md text-white/80 hover:text-amber-400"
                      >
                        <Star className={`w-3.5 h-3.5 ${file.isStarred ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>

                      <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-wider">
                        {file.extension}
                      </div>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors">
                          {file.name}
                        </h3>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{formatSize(file.sizeBytes)}</span>
                          <span className="capitalize">{file.storageProvider}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSocialPublishFile(file);
                          }}
                          className="flex items-center gap-1 text-primary hover:underline font-semibold"
                          title="Publish to Social Feed"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Publish</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShareModalFile(file);
                            }}
                            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                            title="Share"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewFile(file);
                            }}
                            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl bg-card border border-border/50 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-secondary/30 border-b border-border/40 text-muted-foreground font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-8">#</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4 hidden sm:table-cell">Size</th>
                    <th className="py-3 px-4 hidden md:table-cell">Category</th>
                    <th className="py-3 px-4 hidden lg:table-cell">Storage</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {displayedFiles.map((file) => (
                    <tr
                      key={file.id}
                      onClick={() => setPreviewFile(file)}
                      className="hover:bg-secondary/20 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4" onClick={(e) => toggleSelectFile(file.id, e)}>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            selectedFileIds.has(file.id)
                              ? 'bg-primary border-primary text-primary-foreground'
                              : 'border-border/60'
                          }`}
                        >
                          {selectedFileIds.has(file.id) && <Check className="w-3 h-3" />}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-foreground">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-xs">{file.name}</span>
                          {file.isStarred && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground font-mono">
                        {formatSize(file.sizeBytes)}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-muted-foreground capitalize">
                        {file.category}
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground capitalize">
                        {file.storageProvider}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSocialPublishFile(file)}
                            className="p-1 rounded-lg hover:bg-secondary text-primary"
                            title="Publish to Social"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setShareModalFile(file)}
                            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                            title="Share Link"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={file.storageUrl || '#'}
                            download={file.name}
                            className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <UniversalFilePreview
        file={previewFile}
        isOpen={previewFile !== null}
        onClose={() => setPreviewFile(null)}
        onPublishToSocial={(f) => {
          setPreviewFile(null);
          setSocialPublishFile(f);
        }}
        onShare={(f) => {
          setPreviewFile(null);
          setShareModalFile(f);
        }}
      />

      <ChunkedUploader
        isOpen={uploaderOpen}
        currentFolderId={currentFolderId}
        onClose={() => setUploaderOpen(false)}
        onUploadSuccess={(newFile) => {
          setFiles((prev) => [newFile, ...prev]);
        }}
      />

      <PublishToSocialModal
        file={socialPublishFile}
        isOpen={socialPublishFile !== null}
        onClose={() => setSocialPublishFile(null)}
        onPublished={() => {
          alert('Asset published to social feed with zero storage duplication!');
        }}
      />

      {shareModalFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card border border-border/60 rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                <Share2 className="w-4 h-4 text-primary" />
                <span>Share "{shareModalFile.name}"</span>
              </div>
              <button
                onClick={() => setShareModalFile(null)}
                className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Anyone with this link can view and download this file directly.
            </p>

            <div className="p-3 rounded-2xl bg-secondary/40 border border-border/50 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-primary truncate">
                {typeof window !== 'undefined' ? `${window.location.origin}/s/${shareModalFile.id}` : `/s/${shareModalFile.id}`}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/s/${shareModalFile.id}`);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/40">
              <span>Password Protection: Optional</span>
              <span className="text-emerald-500 font-semibold">Public Link Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}