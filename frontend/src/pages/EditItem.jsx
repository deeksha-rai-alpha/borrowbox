import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ItemForm from "../components/ItemForm";
import Loader from "../components/ui/Loader";
import { getErrorMessage } from "../utils/helpers";

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/items/${id}`);
        setItem(res.data.item);
        setExistingImages(res.data.item.images || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const onSubmit = async (data) => {
    setServerError("");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("condition", data.condition);
      formData.append("location", data.location);
      files.forEach((file) => formData.append("images", file));

      await api.put(`/items/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/item/${id}`);
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading item..." />;
  if (!item) return <section className="section container">Item not found.</section>;

  return (
    <section className="section container">
      <h2>Edit item</h2>
      <p className="text-muted" style={{ marginBottom: "2rem" }}>
        Update the details for "{item.title}".
      </p>

      <ItemForm
        defaultValues={{
          title: item.title,
          description: item.description,
          category: item.category,
          condition: item.condition,
          location: item.location,
        }}
        onSubmit={onSubmit}
        submitting={submitting}
        submitLabel="Save changes"
        files={files}
        onFilesChange={setFiles}
        existingImages={existingImages}
        onRemoveExisting={(index) =>
          setExistingImages((prev) => prev.filter((_, i) => i !== index))
        }
        serverError={serverError}
      />
    </section>
  );
};

export default EditItem;
