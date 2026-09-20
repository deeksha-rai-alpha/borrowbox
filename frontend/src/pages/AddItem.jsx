import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ItemForm from "../components/ItemForm";
import { getErrorMessage } from "../utils/helpers";

const AddItem = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

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

      const res = await api.post("/items", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/item/${res.data.item._id}`);
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section container">
      <h2>List a new item</h2>
      <p className="text-muted" style={{ marginBottom: "2rem" }}>
        Add a few details and photos so people know what they're borrowing.
      </p>

      <ItemForm
        onSubmit={onSubmit}
        submitting={submitting}
        submitLabel="List item"
        files={files}
        onFilesChange={setFiles}
        serverError={serverError}
      />
    </section>
  );
};

export default AddItem;
