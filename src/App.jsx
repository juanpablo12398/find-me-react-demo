import React, { useEffect, useMemo, useState } from "react";
import { demoApi } from "./api";
import MapPanel from "./MapPanel";

const labels = {
  RECIBIDO: "Pending review",
  EN_REVISION: "In review",
  REQUIERE_MAS_INFORMACION: "Needs context",
  PUBLICADO_NO_VERIFICADO: "Public · unverified",
  RESTRINGIDO: "Restricted",
  OCULTO_POR_SEGURIDAD: "Hidden for safety",
  DESCARTADO: "Discarded",
  ESCALADO_AUTORIDAD: "Escalated",
};

export default function App() {
  const [records, setRecords] = useState([]);
  const [audit, setAudit] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState("review");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [mapRevision, setMapRevision] = useState(0);

  useEffect(() => {
    let active = true;
    demoApi
      .reports()
      .then((items) => {
        if (!active) return;
        setRecords(items);
        setSelected((previous) => previous ?? items[0]?.id ?? null);
      })
      .catch((failure) => {
        if (active) setError(failure.message);
      });
    demoApi
      .audit()
      .then((items) => {
        if (active) setAudit(items);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(
    () =>
      records.filter(
        (item) =>
          (filter === "All" || item.state === filter) &&
          `${item.id} ${item.area} ${item.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [records, filter, query],
  );
  const activeRecord = records.find((item) => item.id === selected);
  const pending = records.filter((item) => item.state === "RECIBIDO").length;
  const published = records.filter(
    (item) => item.state === "PUBLICADO_NO_VERIFICADO",
  ).length;

  async function changeState(next) {
    if (!activeRecord || busy) return;
    setBusy(true);
    setError("");
    try {
      const updated = await demoApi.review(
        activeRecord.id,
        next,
        "Fictional review action",
      );
      setRecords((items) =>
        items.map((item) => (item.id === updated.id ? updated : item)),
      );
      setMapRevision((value) => value + 1);
      setAudit(await demoApi.audit());
    } catch (failure) {
      setError(failure.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">FM</span>
          <div>
            <strong>Find Me</strong>
            <small>PUBLIC SAMPLE</small>
          </div>
        </div>
        <nav aria-label="Demo sections">
          <button className={page === "review" ? "nav-active" : ""} onClick={() => setPage("review")}>
            ◫ &nbsp; Review queue
          </button>
          <button className={page === "map" ? "nav-active" : ""} onClick={() => setPage("map")}>
            ◉ &nbsp; Public map
          </button>
          <button className={page === "audit" ? "nav-active" : ""} onClick={() => setPage("audit")}>
            ◇ &nbsp; Audit trail
          </button>
        </nav>
        <div className="sidebar-note">
          This interface connects to a local Spring Boot and PostGIS demo.
          Every record is fictional. It cannot accept real reports or verify
          identities.
        </div>
      </aside>
      <main>
        <header>
          <div>
            <span className="eyebrow">REACT · SPRING BOOT · POSTGIS · LEAFLET</span>
            <h1>Responsible review, clear status</h1>
            <p>
              A public slice of the private project: review a fictional report,
              inspect its audit event, and see only published, unverified markers
              on the map.
            </p>
          </div>
          <span className="badge">Demo data only</span>
        </header>
        {error && <p className="api-error" role="alert">{error}</p>}
        <section className="stats">
          <article><small>Demo records</small><strong>{records.length}</strong><span>from PostgreSQL</span></article>
          <article><small>Awaiting review</small><strong>{pending}</strong><span>private until reviewed</span></article>
          <article><small>Public · unverified</small><strong>{published}</strong><span>visible on the map</span></article>
        </section>

        {page === "review" && (
          <section className="workspace">
            <div className="list-panel">
              <div className="panel-heading">
                <div><h2>Review queue</h2><p>Fictional records loaded from the demo API</p></div>
              </div>
              <div className="controls">
                <input aria-label="Search records" placeholder="Search demo ID or area"
                  value={query} onChange={(event) => setQuery(event.target.value)} />
                <select aria-label="Filter status" value={filter}
                  onChange={(event) => setFilter(event.target.value)}>
                  <option value="All">All</option>
                  {Object.entries(labels).map(([value, label]) =>
                    <option value={value} key={value}>{label}</option>)}
                </select>
              </div>
              <div className="records">
                {visible.length ? visible.map((item) => (
                  <button key={item.id} className={`record ${selected === item.id ? "selected" : ""}`}
                    onClick={() => setSelected(item.id)}>
                    <span className="record-top">
                      <strong>{item.id.slice(-3).replace(/^/, "DEMO-")}</strong>
                      <em className="status">{labels[item.state]}</em>
                    </span>
                    <span>{item.category} · {item.area}</span>
                    <small>Received {item.receivedAt} · fictional timestamp</small>
                  </button>
                )) : <p className="empty">No fictional records match this filter.</p>}
              </div>
            </div>
            <div className="detail-panel">
              <div className="panel-heading">
                <div><span className="eyebrow">DEMO REVIEWER VIEW</span>
                  <h2>{activeRecord ? `DEMO-${activeRecord.id.slice(-3)}` : "Select a record"}</h2>
                </div><span className="dot" />
              </div>
              {activeRecord && (
                <>
                  <div className="notice">
                    <strong>Unverified community information</strong>
                    <p>No item here is a confirmed sighting or official missing person report.</p>
                  </div>
                  <dl>
                    <div><dt>Area</dt><dd>{activeRecord.area}</dd></div>
                    <div><dt>Type</dt><dd>{activeRecord.category}</dd></div>
                    <div><dt>Current state</dt><dd>{labels[activeRecord.state]}</dd></div>
                  </dl>
                  <h3>Review summary</h3>
                  <p className="detail-copy">{activeRecord.description}</p>
                  <div className="actions">
                    {["RECIBIDO", "EN_REVISION"].includes(activeRecord.state) && (
                      <>
                        <button disabled={busy} onClick={() => changeState("PUBLICADO_NO_VERIFICADO")}>
                          Publish unverified
                        </button>
                        <button disabled={busy} className="secondary"
                          onClick={() => changeState("REQUIERE_MAS_INFORMACION")}>
                          Request context
                        </button>
                      </>
                    )}
                    {activeRecord.state === "REQUIERE_MAS_INFORMACION" && (
                      <button disabled={busy} onClick={() => changeState("EN_REVISION")}>Resume review</button>
                    )}
                    {activeRecord.state === "PUBLICADO_NO_VERIFICADO" && (
                      <button disabled={busy} onClick={() => changeState("RESTRINGIDO")}>Restrict</button>
                    )}
                  </div>
                  <p className="caption">Actions write to local PostgreSQL and create an audit event. This demo header is not production authentication.</p>
                </>
              )}
            </div>
          </section>
        )}
        {page === "map" && <MapPanel revision={mapRevision} />}
        {page === "audit" && (
          <section className="list-panel">
            <div className="panel-heading"><div><h2>Review audit</h2><p>Events from the demo API</p></div></div>
            <div className="records">
              {audit.length ? audit.map((event, index) => (
                <article className="record" key={`${event.sightingId}-${index}`}>
                  <strong>DEMO-{event.sightingId.slice(-3)}</strong>
                  <span>{labels[event.before]} → {labels[event.after]}</span>
                  <small>{event.reason} · {event.at}</small>
                </article>
              )) : <p>No review actions recorded yet.</p>}
            </div>
          </section>
        )}
        <footer>Public, fictional sample by Juan Pablo Verdondoni · The full application and identity flow remain private.</footer>
      </main>
    </div>
  );
}
