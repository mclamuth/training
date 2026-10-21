import { Link } from 'react-router';
import { PagePlaceholder } from '../components/PagePlaceholder';
import { Icon } from '../components/ui/Icon';

export { DesignSystemPage } from './DesignSystemPage';

export function BrowsePage() {
  return (
    <PagePlaceholder
      title="Browse trainings"
      description="Find a training and register for the sessions that fit your schedule."
      phase="step 3"
      icon="search"
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
      phase="step 4"
      icon="book"
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
      phase="step 4"
      icon="approvals"
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
      phase="step 2"
      icon="teach"
    >
      <p>Upcoming sessions, enrollment against minimums, and creating a new training.</p>
    </PagePlaceholder>
  );
}

export function AdminPage() {
  return (
    <PagePlaceholder
      title="Admin"
      description="Settings that apply to every training."
      phase="steps 2 and 6"
      icon="admin"
    >
      <p>Categories, locations, hotels, email templates, supervisor assignments, roles and the audit log.</p>
    </PagePlaceholder>
  );
}

export function NotFoundPage() {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name="search" />
      </span>
      <h1>Page not found</h1>
      <p>That link doesn't go anywhere.</p>
      <Link className="button button-secondary" to="/">
        Browse trainings
      </Link>
    </div>
  );
}
