import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";

export default function NotFound() {
  return (
    <PageHero
      eyebrow="404"
      title="That page moved."
      lede="The link you followed does not exist any more. Everything else is one tap away."
    >
      <Link className="btn btn--accent" to="/">
        Back to home
        <span className="arrow" aria-hidden="true">→</span>
      </Link>
    </PageHero>
  );
}
