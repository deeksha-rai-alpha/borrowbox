import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ItemCard from "../components/ui/ItemCard";
import { CardSkeletonGrid } from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { Select } from "../components/ui/FormFields";
import Button from "../components/ui/Button";
import "./Browse.css";

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

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const condition = searchParams.get("condition") || "";
  const location = searchParams.get("location") || "";
  const page = Number(searchParams.get("page")) || 1;

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setSearchParams(next);
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/items", {
        params: { search, category, condition, location, page, limit: 9 },
      });
      setItems(res.data.items);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, condition, location, page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const clearFilters = () => setSearchParams({});

  return (
    <section className="section container">
      <div className="bb-browse__header">
        <div>
          <h2>Browse items</h2>
          <p className="text-muted">Find something to borrow near you.</p>
        </div>
      </div>

      <div className="bb-browse__filters">
        <input
          type="text"
          placeholder="Search by name, category or location..."
          className="bb-browse__search"
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("search", e.target.value);
          }}
          onBlur={(e) => updateParam("search", e.target.value)}
        />
        <Select
          placeholder="All categories"
          options={CATEGORIES}
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
        />
        <Select
          placeholder="Any condition"
          options={CONDITIONS}
          value={condition}
          onChange={(e) => updateParam("condition", e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          className="bb-browse__search bb-browse__search--sm"
          defaultValue={location}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("location", e.target.value);
          }}
          onBlur={(e) => updateParam("location", e.target.value)}
        />
        {(search || category || condition || location) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {loading ? (
        <CardSkeletonGrid count={9} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No items found"
          description="Try adjusting your search or filters, or check back later."
        />
      ) : (
        <>
          <div className="grid grid-cols-3">
            {items.map((item) => (
              <ItemCard item={item} key={item._id} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="bb-browse__pagination">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => updateParam("page", String(page - 1))}
              >
                Previous
              </Button>
              <span className="text-muted">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => updateParam("page", String(page + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Browse;
