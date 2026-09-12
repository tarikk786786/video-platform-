'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  Film,
  Image,
  Music,
  FileText,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contentType, setContentType] = useState<'video' | 'image' | 'audio' | 'document' | 'text'>('video');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [visibility, setVisibility] = useState('public');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (!title) {
        const name = selected.name.replace(/\.[^/.]+$/, '');
        setTitle(name);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      if (!title) {
        setTitle(selected.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a content title.');
      return;
    }

    if (!file && contentType !== 'text') {
      setErrorMsg('Please select a media file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('type', contentType);
      formData.append('category', category);
      formData.append('visibility', visibility);

      setUploadProgress(50);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(90);

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Upload request failed');
      }

      setUploadProgress(100);
      setSuccessMsg('Content successfully submitted! Media worker is now processing.');
      
      setTimeout(() => {
        router.push('/creator');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Publish to FreedomPlay</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Share videos, audio, images, documents, or write text posts with zero arbitrary restrictions.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2 bg-secondary/40 p-1.5 rounded-2xl border border-border/40">
        {[
          { type: 'video', label: 'Video', icon: Film },
          { type: 'image', label: 'Image', icon: Image },
          { type: 'audio', label: 'Audio', icon: Music },
          { type: 'document', label: 'Document', icon: FileCode },
          { type: 'text', label: 'Post', icon: FileText },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = contentType === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => {
                setContentType(item.type as any);
                setFile(null);
              }}
              className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {contentType !== 'text' && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              file
                ? 'border-primary bg-primary/5'
                : 'border-border/60 hover:border-primary/60 bg-secondary/20 hover:bg-secondary/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept={
                contentType === 'video'
                  ? 'video/mp4,video/webm,video/quicktime'
                  : contentType === 'image'
                  ? 'image/*'
                  : contentType === 'audio'
                  ? 'audio/*'
                  : '.pdf,.doc,.docx,.epub,.txt'
              }
            />

            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-3 shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>

            {file ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to process
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  Click to choose or drag & drop your {contentType}
                </p>
                <p className="text-xs text-muted-foreground">
                  MP4, WebM, high-resolution media up to 2GB supported
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Title
          </label>
          <input
            type="text"
            required
            placeholder="Give your content a memorable title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-secondary/40 border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Description / Body
          </label>
          <textarea
            rows={4}
            placeholder="Add context, links, or discussion questions for viewers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-secondary/40 border border-border/60 rounded-xl p-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-secondary/40 border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {['Technology', 'Freedom', 'Education', 'News', 'Gaming', 'Music', 'Art', 'Science', 'Lifestyle'].map((c) => (
                <option key={c} value={c} className="bg-card">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full bg-secondary/40 border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="public" className="bg-card">Public (Visible in feeds & search)</option>
              <option value="unlisted" className="bg-card">Unlisted (Anyone with link)</option>
              <option value="followers_only" className="bg-card">Followers Only</option>
              <option value="private" className="bg-card">Private (Only you)</option>
            </select>
          </div>
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span>Uploading & Dispatching to Worker</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-destructive/15 text-destructive text-sm border border-destructive/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-sm border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Media Upload...</span>
            </>
          ) : (
            <span>Publish Content Now</span>
          )}
        </button>
      </form>
    </div>
  );
}