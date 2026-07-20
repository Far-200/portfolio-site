import defaultProfileImage from "../assets/profile.jpg";

function SocialProfileLink({
  href,
  label,
  handle,
  children,
  className = "",
  ariaLabel,
  profileImage = defaultProfileImage,
  profileName = "Farhaan Khan",
}) {
  return (
    <span className={`social-profile-link ${className}`.trim()}>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={ariaLabel || `${label} profile`}
      >
        {children}
      </a>

      <span className="social-profile-preview" aria-hidden="true">
        <img src={profileImage} alt="" />
        <span className="social-profile-preview-copy">
          <strong>{profileName}</strong>
          <span>{label}</span>
          <small>{handle}</small>
        </span>
      </span>
    </span>
  );
}

export default SocialProfileLink;
