import { Link, useOutletContext } from 'react-router';
import { PagePlaceholder } from '../components/PagePlaceholder';
import type { Me } from '../api/me';

export function BrowsePage() {
  const me = useOutletContext<Me>();
  return (
    <PagePlaceholder
      title={`Welcome, ${me.displayName.split(' ')[0] ?? me.displayName}`}
      description="Find trainings and register for the sessions that fit your schedule."
      phase="Phase 1"
    >
      <p>Session cards with seats left, a calendar view, and filters by category, format and date.</p>
    </PagePlaceholder>
  );
}

export function MyTrainingsPage() {
  return (
    <PagePlaceholder
      title="My trainings"
      description="Everything you're signed up for, waiting on, or have completed."
      phase="Phase 2"
    >
      <p>Upcoming, pending approval, waitlisted and past trainings, with certificates to download.</p>
    </PagePlaceholder>
  );
}

export function ApprovalsPage() {
  return (
    <PagePlaceholder
      title="Approvals"
      description="Registration requests from your staff that need your decision."
      phase="Phase 2"
    >
      <p>Approve or deny requests here or from the email link. Requests are never approved automatically.</p>
    </PagePlaceholder>
  );
}

export function TeachingPage() {
  return (
    <PagePlaceholder
      title="My teaching"
      description="The trainings you run, and what needs your attention."
      phase="Phase 1"
    >
      <p>Upcoming sessions, enrollment against minimums, and a guided flow for creating a new training.</p>
    </PagePlaceholder>
  );
}

export function AdminPage() {
  return (
    <PagePlaceholder
      title="Admin"
      description="Settings that apply to every training."
      phase="Phases 1 and 6"
    >
      <p>Categories, locations, hotels, email templates, supervisor assignments, roles and the audit log.</p>
    </PagePlaceholder>
  );
}

export function NotFoundPage() {
  return (
    <section className="page" aria-labelledby="page-title">
      <h1 id="page-title">Page not found</h1>
      <p className="page-description">
        That link doesn't go anywhere. <Link to="/">Browse trainings</Link> instead.
      </p>
    </section>
  );
}
