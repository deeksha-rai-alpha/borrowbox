import { useRef } from "react";
import "./ImageUploader.css";

/**
 * files: array of File objects (new uploads)
 * existingImages: array of { url } already saved on the item (edit mode)
 * onFilesChange: (File[]) => void
 * onRemoveExisting: (index) => void
 */
const ImageUploader = ({
  files,
  onFilesChange,
  existingImages = [],
  onRemoveExisting,
  max = 5,
}) => {
  const inputRef = useRef(null);

  const handlePick = (e) => {
    const picked = Array.from(e.target.files || []);
    const total = existingImages.length + files.length + picked.length;
    if (total > max) {
      alert(`You can upload up to ${max} images total.`);
      return;
    }
    onFilesChange([...files, ...picked]);
    e.target.value = "";
  };

  const removeNew = (index) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="bb-uploader">
      <div className="bb-uploader__grid">
        {existingImages.map((img, i) => (
          <div className="bb-uploader__thumb" key={`existing-${i}`}>
            <img src={img.url} alt={`Item ${i + 1}`} />
            {onRemoveExisting && (
              <button type="button" onClick={() => onRemoveExisting(i)} className="bb-uploader__remove">
                ✕
              </button>
            )}
          </div>
        ))}

        {files.map((file, i) => (
          <div className="bb-uploader__thumb" key={`new-${i}`}>
            <img src={URL.createObjectURL(file)} alt={`Upload ${i + 1}`} />
            <button type="button" onClick={() => removeNew(i)} className="bb-uploader__remove">
              ✕
            </button>
          </div>
        ))}

        {existingImages.length + files.length < max && (
          <button type="button" className="bb-uploader__add" onClick={() => inputRef.current?.click()}>
            <span>+</span>
            <span>Add photo</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handlePick}
      />
      <p className="bb-uploader__hint">Up to {max} images. JPG, PNG or WEBP.</p>
    </div>
  );
};

export default ImageUploader;
