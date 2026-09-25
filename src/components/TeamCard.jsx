import { asset } from "../lib/asset";

/* One board member. Falls back to an initials avatar when there is no photo. */

const initials = (name) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

export default function TeamCard({ name, role, photo, bio }) {
  return (
    <article className="team-card">
      <div className="team-card__media">
        {photo ? (
          <img
            className="team-card__photo"
            src={asset(photo)}
            alt={`${name}, ${role}`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="team-card__initials" aria-hidden="true">
            {initials(name)}
          </span>
        )}
      </div>
      <div className="team-card__body">
        <h3 className="team-card__name">{name}</h3>
        <p className="team-card__role">{role}</p>
        {bio && <p className="team-card__bio">{bio}</p>}
      </div>
    </article>
  );
}
