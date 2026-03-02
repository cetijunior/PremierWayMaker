import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { HiArrowUpTray, HiDocument } from 'react-icons/hi2';

export default function FileUpload({ onFileSelect, accept = '.pdf,.doc,.docx' }) {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const inputRef = useRef(null);

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      setFileSize(formatSize(file.size));
      onFileSelect(file);
    }
  }

  function handleChange(e) {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(formatSize(file.size));
      onFileSelect(file);
    }
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-navy mb-1.5 tracking-wide">
        {t('form.cv_label')}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? 'border-gold bg-gold/5 shadow-[0_0_16px_rgba(245,183,49,0.1)]'
            : fileName
              ? 'border-green-300 bg-green-50/50'
              : 'border-gray-200 hover:border-blue/40 bg-cream/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        {fileName ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <HiDocument className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="text-navy font-medium text-sm">{fileName}</p>
              <p className="text-text-light text-xs">{fileSize}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center">
              <HiArrowUpTray className="w-6 h-6 text-navy/40" />
            </div>
            <p className="text-text-light text-sm">
              {t('form.cv_drag')}{' '}
              <span className="text-blue font-semibold underline underline-offset-2">{t('form.cv_browse')}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
