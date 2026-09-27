import { Link, useOutletContext } from "react-router-dom";
import { FaEdit, FaEnvelope, FaFilePdf, FaGraduationCap } from "react-icons/fa";
import { fileUrl } from "../api";
import { Avatar, Loader, PageHeader } from "../components/ui";
import { formatDate } from "../utils/format";

function ProfileCard({ title, children, className = "" }) {
  return (
    <section className={`ic-card ${className}`}>
      <div className="ic-card-header">
        <h2>{title}</h2>
      </div>
      <div className="ic-card-body">{children}</div>
    </section>
  );
}

function ChipSection({ items, emptyText }) {
  if (!items?.length) return <p className="placeholder-text">{emptyText}</p>;
  return (
    <div className="chip-list">
      {items.map((item, index) => (
        <span key={`${item}-${index}`} className="chip">
          {item}
        </span>
      ))}
    </div>
  );
}

function ViewProfile() {
  const { user } = useOutletContext();

  if (!user) return <Loader label="Loading your profile…" page />;

  const isStudent = user.role === "student";
  const checks = isStudent
    ? [
        user.photo,
        user.bio,
        user.education,
        user.yearOfPassing,
        user.skills?.length,
        user.interests?.length,
        user.resume,
      ]
    : [user.photo, user.bio];
  const completion = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return (
    <>
      <PageHeader title="My profile" subtitle="This is how recruiters and the InternConnect team see you." />

      <section className="ic-card profile-hero">
        <div className="profile-cover" />
        <div className="profile-hero-body">
          <Avatar user={user} size="xl" />
          <div className="profile-identity">
            <h1>{user.name}</h1>
            <p>
              <FaEnvelope aria-hidden="true" /> {user.email}
            </p>
            <div className="chip-list">
              <span className="chip text-capitalize">{user.role}</span>
              {user.education && (
                <span className="chip chip-muted">
                  <FaGraduationCap className="me-1" aria-hidden="true" /> {user.education}
                </span>
              )}
            </div>
          </div>
          <div className="profile-actions">
            {user.resume && (
              <a
                href={fileUrl(user.resume)}
                className="btn btn-light"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFilePdf aria-hidden="true" /> View resume
              </a>
            )}
            <Link to="/edit-profile" className="btn btn-primary">
              <FaEdit aria-hidden="true" /> Edit profile
            </Link>
          </div>
        </div>
      </section>

      <div className="profile-grid">
        <ProfileCard title="About" className="span-2">
          {user.bio ? (
            <p className="mb-0">{user.bio}</p>
          ) : (
            <p className="placeholder-text">No bio added yet.</p>
          )}
        </ProfileCard>

        {isStudent && (
          <>
            <ProfileCard title="Education">
              <dl className="info-list">
                <div>
                  <dt>Level</dt>
                  <dd>{user.education || "—"}</dd>
                </div>
                <div>
                  <dt>Year of passing</dt>
                  <dd>{user.yearOfPassing || "—"}</dd>
                </div>
                <div>
                  <dt>Resume</dt>
                  <dd>
                    {user.resume ? (
                      <a href={fileUrl(user.resume)} target="_blank" rel="noopener noreferrer">
                        Uploaded
                      </a>
                    ) : (
                      "Not uploaded"
                    )}
                  </dd>
                </div>
              </dl>
            </ProfileCard>

            <ProfileCard title="Profile strength">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Completion</span>
                <strong>{completion}%</strong>
              </div>
              <div
                className="completion-bar"
                role="progressbar"
                aria-valuenow={completion}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${completion}%` }} />
              </div>
              <p className="text-muted small mt-3 mb-0">
                {completion === 100
                  ? "Great job! Your profile is complete."
                  : "Complete your profile to stand out to recruiters."}
              </p>
            </ProfileCard>

            <ProfileCard title="Skills">
              <ChipSection items={user.skills} emptyText="No skills added yet." />
            </ProfileCard>

            <ProfileCard title="Interests">
              <ChipSection items={user.interests} emptyText="No interests added yet." />
            </ProfileCard>
          </>
        )}

        {!isStudent && (
          <ProfileCard title="Account" className="span-2">
            <dl className="info-list">
              <div>
                <dt>Role</dt>
                <dd className="text-capitalize">{user.role}</dd>
              </div>
              <div>
                <dt>Member since</dt>
                <dd>{formatDate(user.createdAt)}</dd>
              </div>
            </dl>
          </ProfileCard>
        )}
      </div>
    </>
  );
}

export default ViewProfile;
