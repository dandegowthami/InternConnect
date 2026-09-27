import { Link } from "react-router-dom";
import "../styles/public.css";

function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <div className="code">404</div>
        <h1 className="h3 mt-3">Page not found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist or may have been moved.</p>
        <div className="d-flex justify-content-center gap-2 flex-wrap">
          <Link to="/" className="btn btn-primary">
            Go to homepage
          </Link>
          <Link to="/internships" className="btn btn-light">
            Browse internships
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
