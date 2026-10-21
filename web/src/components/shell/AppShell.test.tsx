import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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
  displayName: 'Pat Lee',
  email: 'pat.lee@cta.org',
  roles: ['Employee'],
  isOption2: false,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AppShell', () => {
  it('renders the CTA header with the app launcher, title and user', async () => {
    renderAt('/', employee);

    const header = screen.getByRole('banner');
    expect(within(header).getByRole('button', { name: 'CTA apps' })).toBeInTheDocument();
    expect(within(header).getByRole('link', { name: 'CTA Training' })).toBeInTheDocument();
    expect(within(header).getByLabelText('California Teachers Association')).toBeInTheDocument();
    expect(await within(header).findByText('Pat Lee')).toBeInTheDocument();
  });

  it('greets the user on the browse page', async () => {
    renderAt('/', employee);

    expect(await screen.findByRole('heading', { name: 'Welcome, Pat' })).toBeInTheDocument();
  });

  it('hides trainer and admin links from employees', async () => {
    renderAt('/', employee);

    const nav = await screen.findByRole('navigation', { name: 'Main' });
    expect(await within(nav).findByRole('link', { name: 'My trainings' })).toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: 'My teaching' })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
  });

  it('shows the admin link to admins', async () => {
    renderAt('/', { ...employee, roles: ['Employee', 'Admin'] });

    const nav = await screen.findByRole('navigation', { name: 'Main' });
    expect(await within(nav).findByRole('link', { name: 'Admin' })).toBeInTheDocument();
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
