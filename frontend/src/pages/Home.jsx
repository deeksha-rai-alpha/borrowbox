import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import FloatingImageCard from "../components/ui/FloatingImageCard";
import { HERO_IMAGES } from "../utils/imageConfig";
import "./Home.css";

const CATEGORIES = [
  "Books",
  "Cameras & Electronics",
  "Tools",
  "Camping & Outdoor",
  "Sports Equipment",
  "Party & Decorations",
  "Agricultural Tools",
  "Study Materials",
];

const STEPS = [
  { title: "List an item", body: "Add something you own but rarely use — a camera, a projector, a tent." },
  { title: "Get a request", body: "Nearby members request it for the exact dates they need it." },
  { title: "Approve & lend", body: "Accept the request, hand it over, and track the return date." },
  { title: "Get it back & review", body: "Confirm the return and leave a rating for the next borrower." },
];

const Home = () => {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="section bb-hero">
        <div className="container bb-hero__grid">
          <div className="bb-hero__copy">
            <span className="eyebrow">
              <span className="eyebrow-dot" /> Community borrowing, made simple
            </span>
            <h1>
              Borrow what you need. <br />
              Lend what you don't.
            </h1>
            <p className="bb-hero__sub">
              BorrowBox connects neighbours who own occasionally-used items — cameras, tools,
              books, party gear — with people who need them for a few days, not forever.
            </p>
            <div className="flex gap-3 bb-hero__cta">
              <Link to="/browse">
                <Button variant="primary">Browse items</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">List your first item</Button>
              </Link>
            </div>
          </div>

          <div className="bb-hero__visual">
            <div className="bb-hero__visual-main">
              <FloatingImageCard src={HERO_IMAGES.main} alt="Borrowed camera equipment" aspect="1/1" />
            </div>
            <div className="bb-hero__visual-small bb-hero__visual-small--one">
              <FloatingImageCard src={HERO_IMAGES.books} alt="Stack of books" aspect="1/1" offset />
            </div>
            <div className="bb-hero__visual-small bb-hero__visual-small--two">
              <FloatingImageCard src={HERO_IMAGES.tools} alt="Hand tools" aspect="1/1" offset />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section className="section bb-categories">
        <div className="container">
          <h2 className="bb-section-title">What people are lending</h2>
          <div className="bb-categories__row">
            {CATEGORIES.map((cat) => (
              <Link to={`/browse?category=${encodeURIComponent(cat)}`} key={cat} className="bb-chip">
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- How it works ---------------- */}
      <section className="section bb-steps">
        <div className="container">
          <h2 className="bb-section-title">How BorrowBox works</h2>
          <div className="grid grid-cols-4 bb-steps__grid">
            {STEPS.map((step, i) => (
              <div className="bb-step" key={step.title}>
                <span className="bb-step__num">{String(i + 1).padStart(2, "0")}</span>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="section">
        <div className="container bb-cta">
          <div>
            <h2>Got something gathering dust?</h2>
            <p>List it in under two minutes and start lending to people nearby.</p>
          </div>
          <Link to="/register">
            <Button variant="primary">Create free account</Button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
