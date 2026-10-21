import { useState, type ReactNode } from "react"
import { Button } from "../components/ui/Button"
import { Chip, FormatBadge, type ChipTone } from "../components/ui/Chip"
import { Field } from "../components/ui/Field"
import { Icon } from "../components/ui/Icon"
import { Dialog, Drawer } from "../components/ui/Overlay"
import { useToast } from "../components/ui/toastContext"
import "../styles/design-system.css"

// Ported from the approved Figma Make design: the living reference for the
// CTA Training design system. Sample content only; nothing here calls the API.

const demoTones: Record<string, ChipTone> = {
  "6 seats left": "green",
  "2 seats left": "amber",
  "Full - join waitlist": "red",
  "Opens Jan 5": "blue",
  "On demand": "gray",
  "Pending approval": "amber",
  Approved: "green",
  "Waitlisted #3": "blue",
  Denied: "red",
  Cancelled: "gray",
  Completed: "green",
}

function DemoChip({ children }: { children: string }) {
  return <Chip tone={demoTones[children] ?? "gray"}>{children}</Chip>
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="ds-section">
      <div className="section-heading">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <div className="component-surface">{children}</div>
    </section>
  )
}

export function DesignSystemPage() {
  const [tab, setTab] = useState("Upcoming")
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const showToast = useToast()

  return (
    <div className="design-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">Foundation</div>
          <h1>CTA Training design system</h1>
          <p>
            Reusable patterns for a clear, consistent, and accessible training
            experience.
          </p>
        </div>
        <span className="version-badge">Version 1.0</span>
      </div>

      <Section
        title="Foundations"
        description="Color, type, and spacing establish a calm and professional visual language."
      >
        <div className="foundations-grid">
          <div>
            <h3>Color</h3>
            <div className="swatches">
              {[
                ["CTA blue", "swatch-blue", "#00609C"],
                ["Dark blue", "swatch-dark", "#004A78"],
                ["Light blue", "swatch-light", "#E6F0F7"],
                ["Text", "swatch-text", "#1D2329"],
                ["Border", "swatch-border", "#D9DEE3"],
              ].map(([name, className, hex]) => (
                <div className="swatch-row" key={name}>
                  <span className={`swatch ${className}`} />
                  <span>
                    <strong>{name}</strong>
                    <small>{hex}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3>Typography</h3>
            <div className="type-samples">
              <div className="type-page">
                Page title <span>28 / Semibold</span>
              </div>
              <div className="type-section">
                Section title <span>20 / Semibold</span>
              </div>
              <div className="type-body">
                Body text <span>16 / Regular</span>
              </div>
              <div className="type-secondary">
                Secondary text <span>14 / Regular</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Buttons"
        description="Use one primary action per task area."
      >
        <div className="component-row">
          <Button>Register</Button>
          <Button variant="secondary">Save draft</Button>
          <Button variant="text">View details</Button>
          <Button variant="destructive">Cancel training</Button>
          <Button disabled>Unavailable</Button>
        </div>
      </Section>

      <Section
        title="Form controls"
        description="Every control includes a visible label and space for guidance or validation."
      >
        <div className="form-grid">
          <Field label="Training title" help="Use a clear, descriptive title.">
            <input defaultValue="Microsoft Teams essentials" />
          </Field>
          <Field label="Topic" help="Choose the closest topic.">
            <span className="select-wrap">
              <select defaultValue="Microsoft 365">
                <option>Microsoft 365</option>
                <option>AI tools</option>
                <option>Collective bargaining</option>
              </select>
              <Icon name="chevronDown" size={17} />
            </span>
          </Field>
          <Field label="Session date" help="Pacific time">
            <span className="input-icon-wrap">
              <input type="date" defaultValue="2025-01-16" />
              <Icon name="calendar" size={18} />
            </span>
          </Field>
          <Field
            label="Facilitator email"
            error="Enter a valid CTA email address."
          >
            <input aria-invalid="true" defaultValue="alex@" />
          </Field>
          <Field
            label="Search trainings"
            help="Search by title, trainer, or topic."
          >
            <span className="search-wrap">
              <Icon name="search" size={18} />
              <input placeholder="Search trainings" />
            </span>
          </Field>
          <div className="choice-groups">
            <fieldset>
              <legend>Options</legend>
              <label className="choice">
                <input type="checkbox" defaultChecked />{" "}
                <span>Notify registrants</span>
              </label>
              <label className="choice">
                <input type="checkbox" /> <span>Add to calendar</span>
              </label>
            </fieldset>
            <fieldset>
              <legend>Approval</legend>
              <label className="choice">
                <input name="approval" type="radio" defaultChecked />{" "}
                <span>Required</span>
              </label>
              <label className="choice">
                <input name="approval" type="radio" /> <span>Not required</span>
              </label>
            </fieldset>
          </div>
        </div>
      </Section>

      <Section
        title="Status and format"
        description="Labels always pair color with clear language or an icon."
      >
        <div className="status-groups">
          <div>
            <h3>Availability</h3>
            <div className="component-row compact">
              {[
                "6 seats left",
                "2 seats left",
                "Full - join waitlist",
                "Opens Jan 5",
                "On demand",
              ].map((item) => (
                <DemoChip key={item}>{item}</DemoChip>
              ))}
            </div>
          </div>
          <div>
            <h3>Registration status</h3>
            <div className="component-row compact">
              {[
                "Pending approval",
                "Approved",
                "Waitlisted #3",
                "Denied",
                "Cancelled",
                "Completed",
              ].map((item) => (
                <DemoChip key={item}>{item}</DemoChip>
              ))}
            </div>
          </div>
          <div>
            <h3>Format</h3>
            <div className="component-row compact">
              <FormatBadge format="Webinar" />
              <FormatBadge format="On site" />
              <FormatBadge format="On demand" />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Cards and tabs"
        description="Group related content without adding unnecessary visual weight."
      >
        <div className="tabs" role="tablist" aria-label="Training date">
          {["Upcoming", "Past", "Drafts"].map((item) => (
            <button
              aria-selected={tab === item}
              className={tab === item ? "active" : ""}
              key={item}
              onClick={() => setTab(item)}
              role="tab"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="training-cards">
          <article className="training-card">
            <div className="card-meta">
              <FormatBadge format="Webinar" />
              <DemoChip>6 seats left</DemoChip>
            </div>
            <h3>Using Copilot responsibly</h3>
            <p>
              Practical guidance for using AI tools securely and effectively in
              your daily work.
            </p>
            <div className="card-footer">
              <span>
                <Icon name="calendar" size={17} /> Jan 16 · 10:00 AM
              </span>
              <Button variant="secondary">View training</Button>
            </div>
          </article>
          <article className="training-card">
            <div className="card-meta">
              <FormatBadge format="On site" />
              <DemoChip>2 seats left</DemoChip>
            </div>
            <h3>Collective bargaining fundamentals</h3>
            <p>
              An introduction to the bargaining process, roles, and core
              concepts for CTA staff.
            </p>
            <div className="card-footer">
              <span>
                <Icon name="calendar" size={17} /> Jan 23 · 1:00 PM
              </span>
              <Button variant="secondary">View training</Button>
            </div>
          </article>
        </div>
      </Section>

      <Section
        title="Table"
        description="Sortable headers help people scan and manage structured information."
      >
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {["Employee", "Training", "Requested", "Status"].map(
                  (heading) => (
                    <th key={heading}>
                      <button>
                        {heading}
                        <Icon name="sort" size={15} />
                      </button>
                    </th>
                  ),
                )}
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Jordan Lee</strong>
                  <small>Organizing</small>
                </td>
                <td>Microsoft Teams essentials</td>
                <td>Jan 8, 2025</td>
                <td>
                  <DemoChip>Pending approval</DemoChip>
                </td>
                <td>
                  <Button variant="text">Review</Button>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Sam Rivera</strong>
                  <small>Legal</small>
                </td>
                <td>Using Copilot responsibly</td>
                <td>Jan 7, 2025</td>
                <td>
                  <DemoChip>Approved</DemoChip>
                </td>
                <td>
                  <Button variant="text">View</Button>
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Casey Wong</strong>
                  <small>Field services</small>
                </td>
                <td>Collective bargaining fundamentals</td>
                <td>Jan 6, 2025</td>
                <td>
                  <DemoChip>Waitlisted #3</DemoChip>
                </td>
                <td>
                  <Button variant="text">View</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Feedback and overlays"
        description="Dialogs, drawers, and messages keep people oriented while completing tasks."
      >
        <div className="component-row">
          <Button onClick={() => setModalOpen(true)}>Open dialog</Button>
          <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
            Open side panel
          </Button>
          <Button variant="text" onClick={() => showToast("Registration requested", "We sent your request to your manager.")}>
            Show toast
          </Button>
        </div>
        <div className="empty-state">
          <span className="empty-icon">
            <Icon name="calendar" />
          </span>
          <h3>No trainings scheduled</h3>
          <p>New sessions you schedule will appear here.</p>
          <Button variant="secondary">Schedule training</Button>
        </div>
      </Section>

      {modalOpen && (
        <Dialog
          title="Confirm registration"
          description="Your manager will be asked to approve this request."
          onClose={() => setModalOpen(false)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setModalOpen(false)
                  showToast("Registration requested", "We sent your request to your manager.")
                }}
              >
                Request registration
              </Button>
            </>
          }
        >
          <div className="dialog-summary">
            <Icon name="calendar" />
            <div>
              <strong>Using Copilot responsibly</strong>
              <span>Thursday, January 16 · 10:00–11:30 AM</span>
            </div>
          </div>
        </Dialog>
      )}

      {drawerOpen && (
        <Drawer
          eyebrow="Training details"
          title="Using Copilot responsibly"
          onClose={() => setDrawerOpen(false)}
          actions={
            <>
              <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
                Close
              </Button>
              <Button>Register</Button>
            </>
          }
        >
          <DemoChip>6 seats left</DemoChip>
          <dl>
            <div>
              <dt>Date and time</dt>
              <dd>
                January 16, 2025
                <br />
                10:00–11:30 AM
              </dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>
                <FormatBadge format="Webinar" />
              </dd>
            </div>
            <div>
              <dt>Trainer</dt>
              <dd>Alex Morgan</dd>
            </div>
          </dl>
          <p>
            Learn practical ways to use Microsoft Copilot while protecting
            member and organizational information.
          </p>
        </Drawer>
      )}
    </div>
  )
}
