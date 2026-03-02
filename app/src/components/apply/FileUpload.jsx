import { useState, useRef } from 'react';

export default function FileUpload({ onFileSelect, accept = '.pdf,.doc,.docx' }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

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
      onFileSelect(file);
    }
  }

  function handleChange(e) {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  }

  return (
    <div className="mb-5">
      <label className="block font-semibold mb-1.5 text-[#1B2A4A] text-sm">
        Upload CV (PDF, DOC, DOCX)
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-[#2E6B9E] bg-blue-50'
            : 'border-gray-300 hover:border-[#2E6B9E]'
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
          <p className="text-[#1B2A4A] font-medium">{fileName}</p>
        ) : (
          <p className="text-[#5A6A7A] text-sm">
            Drag & Drop your CV here, or{' '}
            <span className="text-[#2E6B9E] underline">browse</span>
          </p>
        )}
      </div>
    </div>
  );
}
