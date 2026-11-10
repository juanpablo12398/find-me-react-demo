import React, { useMemo, useState } from "react";

// Completely fictional records. No names, photos, locations or reports from the private system.
const seed = [
  {
    id: "DEMO-101",
    area: "North district",
    category: "Community report",
    status: "Pending review",
    received: "09:20",
    detail:
      "A community member submitted a possible observation. No identity is shown.",
  },
  {
    id: "DEMO-102",
    area: "River district",
    category: "Case update",
    status: "Needs context",
    received: "10:45",
    detail:
      "A case update requires additional context before an operator can publish it.",
  },
  {
    id: "DEMO-103",
    area: "Central district",
    category: "Community report",
    status: "Pending review",
    received: "11:15",
    detail: "This fictional report is visible only inside the review queue.",
  },
  {
    id: "DEMO-104",
    area: "South district",
    category: "Case update",
    status: "Reviewed",
    received: "12:30",
    detail: "An operator completed the simulated review.",
  },
];

const options = ["All", "Pending review", "Needs context", "Reviewed"];

export default function App() {
  const [records, setRecords] = useState(seed);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(seed[0].id);
  const visible = useMemo(
    () =>
      records.filter(
        (item) =>
          (filter === "All" || item.status === filter) &&
          `${item.id} ${item.area} ${item.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [records, filter, query],
  );
  const active = records.find((item) => item.id === selected);
  const pending = records.filter(
    (item) => item.status === "Pending review",
  ).length;
  const changeStatus = (status) =>
    setRecords((items) =>
      items.map((item) => (item.id === selected ? { ...item, status } : item)),
    );

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">FM</span>
          <div>
            <strong>Find Me</strong>
            <small>PUBLIC DEMO</small>
          </div>
        </div>
        <nav>
          <span className="nav-active">◫ &nbsp; Review queue</span>
          <span>◉ &nbsp; Case overview</span>
          <span>◇ &nbsp; Activity</span>
        </nav>
        <div className="sidebar-note">
          This interface uses fictional records. It cannot accept real reports
          or verify identities.
        </div>
      </aside>
      <main>
        <header>
          <div>
            <span className="eyebrow">REACT CASE STUDY · SYNTHETIC DATA</span>
            <h1>Responsible review, clear status</h1>
            <p>
              A narrow public sample of the moderation experience. Community
              reports stay unverified until an authorized operator reviews them.
            </p>
          </div>
          <span className="badge">Demo mode</span>
        </header>
        <section className="stats">
          <article>
            <small>Records in queue</small>
            <strong>{records.length}</strong>
            <span>fictional entries</span>
          </article>
          <article>
            <small>Awaiting review</small>
            <strong>{pending}</strong>
            <span>operator action required</span>
          </article>
          <article>
            <small>Public by default</small>
            <strong>0</strong>
            <span>reports remain private</span>
          </article>
        </section>
        <section className="workspace">
          <div className="list-panel">
            <div className="panel-heading">
              <div>
                <h2>Review queue</h2>
                <p>Filter and inspect a simulated workflow</p>
              </div>
            </div>
            <div className="controls">
              <input
                aria-label="Search records"
                placeholder="Search demo ID or area"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <select
                aria-label="Filter status"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                {options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="records">
              {visible.length ? (
                visible.map((item) => (
                  <button
                    key={item.id}
                    className={`record ${selected === item.id ? "selected" : ""}`}
                    onClick={() => setSelected(item.id)}
                  >
                    <span className="record-top">
                      <strong>{item.id}</strong>
                      <em
                        className={`status ${item.status.toLowerCase().replaceAll(" ", "-")}`}
                      >
                        {item.status}
                      </em>
                    </span>
                    <span>
                      {item.category} · {item.area}
                    </span>
                    <small>Received {item.received} · demo timestamp</small>
                  </button>
                ))
              ) : (
                <p className="empty">No fictional records match this filter.</p>
              )}
            </div>
          </div>
          <div className="detail-panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">OPERATOR VIEW</span>
                <h2>{active?.id ?? "Select a record"}</h2>
              </div>
              <span className="dot" />
            </div>
            {active && (
              <>
                <div className="notice">
                  <strong>Unverified community information</strong>
                  <p>
                    Nothing here is a confirmed sighting or an official missing
                    person report.
                  </p>
                </div>
                <dl>
                  <div>
                    <dt>Area</dt>
                    <dd>{active.area}</dd>
                  </div>
                  <div>
                    <dt>Type</dt>
                    <dd>{active.category}</dd>
                  </div>
                  <div>
                    <dt>Current state</dt>
                    <dd>{active.status}</dd>
                  </div>
                </dl>
                <h3>Review summary</h3>
                <p className="detail-copy">{active.detail}</p>
                <div className="actions">
                  <button onClick={() => changeStatus("Reviewed")}>
                    Mark reviewed
                  </button>
                  <button
                    className="secondary"
                    onClick={() => changeStatus("Needs context")}
                  >
                    Request context
                  </button>
                </div>
                <p className="caption">
                  These buttons update only in-memory demo state.
                </p>
              </>
            )}
          </div>
        </section>
        <footer>
          Public demonstration by Juan Pablo Verdondoni · The full application,
          backend, identity flow and data remain private.
        </footer>
      </main>
    </div>
  );
}
