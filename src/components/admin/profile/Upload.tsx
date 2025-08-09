import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { MdFileUpload, MdClose } from 'react-icons/md';
import FormMessage from 'components/fields/FormMessage';

interface UploadProps {
  label?: string;
}

const Upload = ({ label }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setPreview(
        acceptedFiles[0].type.startsWith('image/')
          ? URL.createObjectURL(acceptedFiles[0])
          : '',
      );
      setError(null);
      setProgress(0);
      setUploading(true);
      if (progressRef.current) clearInterval(progressRef.current);
      progressRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setUploading(false);
            if (progressRef.current) clearInterval(progressRef.current);
            return 100;
          }
          return prev + 5;
        });
      }, 80);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    maxFiles: 1,
  });

  const handleRemove = () => {
    setFile(null);
    setPreview('');
    setError(null);
    setProgress(0);
    setUploading(false);
    if (progressRef.current) clearInterval(progressRef.current);
  };

  return (
    <section className="w-full bg-white p-5 my-5 rounded-2xl">
      <div className="max-w-xl mx-auto">
        {label && (
          <div className="mb-2  font-semibold text-lg text-center">{label}</div>
        )}
        {!file ? (
          <div
            {...getRootProps()}
            className={
              'flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition ' +
              (isDragActive
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white')
            }
          >
            <input {...getInputProps()} />
            <MdFileUpload className="text-5xl text-gray-400 " />
            <p className="text-gray-600 text-center">
              {isDragActive
                ? 'Drop the file here ...'
                : 'Drag & drop a file here, or click to select'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              PNG, JPG, GIF allowed. Only one file.
            </p>
          </div>
        ) : (
          <>
            <div className="relative mt-4 flex items-center justify-between bg-gray-50 rounded px-5 py-3">
              <button
                className="absolute -top-6 -right-2 w-5 h-5 text-gray-400 hover:text-red-600 z-10"
                onClick={handleRemove}
                title="Remove"
                type="button"
              >
                <MdClose className="text-lg" />
              </button>
              <div className="flex items-center gap-2 h-40 w-40">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="w-30 h-30 object-cover rounded border cursor-pointer"
                    onClick={() => setShowFullScreen(true)}
                  />
                ) : (
                  <span className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded text-xs text-gray-500">
                    {file.name.split('.').pop()?.toUpperCase()}
                  </span>
                )}
                <span className="text-gray-800 text-sm truncate max-w-[180px]">
                  {file.name}
                </span>
              </div>
            </div>
            {/* Progress bar below file preview */}
            {uploading && (
              <div className="w-full mt-2 h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-green-500 rounded transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            {/* Full screen modal for image preview */}
            {showFullScreen && preview && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" 
                onClick={() => setShowFullScreen(false)}
                style={{ background: 'rgba(0,0,0,0.8)' }}
              >
                <img
                  src={preview}
                  alt="Full Preview"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  onClick={e => e.stopPropagation()}
                />
                <button
                  className="absolute top-0 right-8 text-white text-4xl font-bold z-60 hover:text-red-400"
                  onClick={() => setShowFullScreen(false)}
                  aria-label="Close"
                  type="button"
                >
                  &times;
                </button>
              </div>
            )}
          </>
        )}
        {error && (
          <FormMessage type="error">{error}</FormMessage>
        )}
      </div>
    </section>
  );
};

export default Upload;
