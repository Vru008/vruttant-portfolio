import { useState } from "react";
import { onResumeClick, RESUME_FILENAME } from "../lib/resume";
import { profile } from "../lib/data";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked: the mailto link still works */ }
  };

  return (
    <div className="contact card">
      <p className="contact-lede">
        I'm looking for <b>frontend or full-stack roles</b> where I can ship React features end to end.
        The fastest way to reach me is email.
      </p>
      <div className="contact-row">
        <a className="btn btn-primary big" href={`mailto:${profile.email}`}>{profile.email}</a>
        <button className="btn" onClick={copy}>{copied ? "Copied ✓" : "Copy email"}</button>
      </div>
      <div className="contact-row">
        <a className="btn btn-ghost" href={profile.github} target="_blank" rel="noopener">GitHub ↗</a>
        <a className="btn btn-ghost" href={profile.resume} download={RESUME_FILENAME} onClick={onResumeClick}>Résumé (PDF)</a>
      </div>
    </div>
  );
}
