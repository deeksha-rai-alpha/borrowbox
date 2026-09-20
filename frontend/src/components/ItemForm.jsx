import { useForm } from "react-hook-form";
import Input from "./ui/Input";
import { Textarea, Select } from "./ui/FormFields";
import ImageUploader from "./ui/ImageUploader";
import Button from "./ui/Button";
import "./ItemForm.css";

const CATEGORIES = [
  "Books",
  "Cameras & Electronics",
  "Tools",
  "Camping & Outdoor",
  "Sports Equipment",
  "Party & Decorations",
  "Agricultural Tools",
  "Study Materials",
  "Other",
];
const CONDITIONS = ["New", "Good", "Fair", "Worn"];

/**
 * Shared form for both "Add item" and "Edit item" (FR-04, FR-05).
 * defaultValues: item fields to pre-fill (edit mode)
 * existingImages / onRemoveExisting: already-uploaded images (edit mode)
 */
const ItemForm = ({
  defaultValues = {},
  onSubmit,
  submitting,
  submitLabel = "List item",
  files,
  onFilesChange,
  existingImages = [],
  onRemoveExisting,
  serverError,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bb-itemform">
      <Input
        label="Item title"
        placeholder="e.g. Canon DSLR Camera"
        error={errors.title?.message}
        registration={register("title", { required: "Title is required" })}
      />

      <Textarea
        label="Description"
        placeholder="Describe the item, its condition, and anything a borrower should know."
        error={errors.description?.message}
        registration={register("description", {
          required: "Description is required",
          minLength: { value: 10, message: "Description is required" },
        })}
      />

      <div className="bb-itemform__row">
        <Select
          label="Category"
          options={CATEGORIES}
          error={errors.category?.message}
          registration={register("category", { required: "Category is required" })}
        />
        <Select
          label="Condition"
          options={CONDITIONS}
          error={errors.condition?.message}
          registration={register("condition", { required: "Condition is required" })}
        />
      </div>

      <Input
        label="Location"
        placeholder="e.g. Mangalore"
        error={errors.location?.message}
        registration={register("location", { required: "Location is required" })}
      />

      <div className="bb-field">
        <label className="bb-field__label">Photos</label>
        <ImageUploader
          files={files}
          onFilesChange={onFilesChange}
          existingImages={existingImages}
          onRemoveExisting={onRemoveExisting}
        />
      </div>

      {serverError && <p className="bb-itemform__error">{serverError}</p>}

      <Button type="submit" variant="primary" fullWidth disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
};

export default ItemForm;
