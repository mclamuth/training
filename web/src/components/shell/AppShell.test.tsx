import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routes } from '../../app/routes';
import type { Me } from '../../api/me';

function renderAt(path: string, me: Me) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(me), { status: 200, headers: { 'Content-Type': 'application/json' } })),
  );
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

const employee: Me = {
  id: '00000000-0000-0000-0000-000000000001',
  displayName: 'Pat Nguyen',
  email: 'pat.nguyen@cta.org',
  roles: ['Employee'],
  isOption2: false,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AppShell', () => {
  it('renders the CTA header with the app launcher, app name, logo and user', async () => {
    renderAt('/', employee);

    const header = screen.getByRole('banner');
    expect(within(header).getByRole('button', { name: 'Open app launcher' })).toBeInTheDocument();
    expect(within(header).getByRole('link', { name: 'CTA Training' })).toBeInTheDocument();
    expect(within(header).getByRole('img', { name: 'California Teachers Association' })).toHaveAttribute(
      'src',
      '/cta-logo-white.png',
    );
    expect(await within(header).findByText('Pat Nguyen')).toBeInTheDocument();
  });

  it('opens the app launcher and closes it with Escape', async () => {
    const user = userEvent.setup();
    renderAt('/', employee);

    await user.click(screen.getByRole('button', { name: 'Open app launcher' }));
    expect(screen.getByText('CTA apps')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('CTA apps')).not.toBeInTheDocument();
  });

  it('shows name, email and role in the profile menu', async () => {
    const user = userEvent.setup();
    renderAt('/', employee);

    await user.click(await screen.findByRole('button', { name: /Pat Nguyen/ }));

    expect(screen.getByText('pat.nguyen@cta.org')).toBeInTheDocument();
    expect(screen.getByText('Employee', { selector: '.profile-role' })).toBeInTheDocument();
  });

  it('hides trainer and admin links from employees', async () => {
    renderAt('/', employee);

    const nav = await screen.findByRole('navigation', { name: 'Main navigation' });
    expect(await within(nav).findByRole('link', { name: 'My trainings' })).toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: 'My teaching' })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('shows the admin link to admins and marks the current page', async () => {
    renderAt('/admin', { ...employee, roles: ['Employee', 'Admin'] });

    const nav = await screen.findByRole('navigation', { name: 'Main navigation' });
    expect(await within(nav).findByRole('link', { name: 'Admin' })).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: 'Browse trainings' })).not.toHaveAttribute('aria-current');
  });

  it('blocks employees who open the admin page directly', async () => {
    renderAt('/admin', employee);

    expect(await screen.findByRole('heading', { name: "This page isn't available to you" })).toBeInTheDocument();
  });

  it('shows an error when the account cannot be loaded', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ title: 'Unauthorized' }), { status: 401 })));
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={createMemoryRouter(routes)} />
      </QueryClientProvider>,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Unauthorized');
  });
});

describe('Design system page', () => {
  it('opens the dialog, closes it with Escape, and shows a toast after confirming', async () => {
    const user = userEvent.setup();
    renderAt('/design-system', employee);

    await user.click(await screen.findByRole('button', { name: 'Open dialog' }));
    expect(screen.getByRole('dialog', { name: 'Confirm registration' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));
    await user.click(screen.getByRole('button', { name: 'Request registration' }));
    expect(screen.getByText('Registration requested')).toBeInTheDocument();
  });

  it('opens the side panel', async () => {
    const user = userEvent.setup();
    renderAt('/design-system', employee);

    await user.click(await screen.findByRole('button', { name: 'Open side panel' }));

    expect(screen.getByRole('dialog', { name: 'Using Copilot responsibly' })).toBeInTheDocument();
  });
});
