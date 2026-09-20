import "./Tabs.css";

/**
 * tabs: [{ key, label, count }]
 */
const Tabs = ({ tabs, active, onChange }) => {
  return (
    <div className="bb-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`bb-tabs__item ${active === tab.key ? "is-active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          {typeof tab.count === "number" && <span className="bb-tabs__count">{tab.count}</span>}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
