import "./Loader.css";

const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="bb-loader">
      <span className="bb-loader__spinner" />
      <span className="bb-loader__label">{label}</span>
    </div>
  );
};

// Skeleton grid shown while item cards are loading
export const CardSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bb-loader__card">
          <div className="skeleton bb-loader__card-image" />
          <div className="skeleton bb-loader__card-line" style={{ width: "70%" }} />
          <div className="skeleton bb-loader__card-line" style={{ width: "40%" }} />
        </div>
      ))}
    </div>
  );
};

export default Loader;
