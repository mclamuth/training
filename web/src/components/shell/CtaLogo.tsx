/**
 * Placeholder for the CTA logo. The official artwork comes with the shared
 * header from the Bug Tracking app; until then this shows CTA's name in the
 * same spot so layout and spacing can be reviewed.
 */
export function CtaLogo() {
  return (
    <span className="cta-logo" aria-label="California Teachers Association">
      <span className="cta-logo-mark" aria-hidden="true">
        CTA
      </span>
      <span className="cta-logo-name" aria-hidden="true">
        California
        <br />
        Teachers
        <br />
        Association
      </span>
    </span>
  );
}
