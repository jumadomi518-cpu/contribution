import React, { useEffect, useMemo, useState } from "react";
import {
  Search, Users, Wallet, HeartHandshake, RefreshCw, AlertCircle,
  CheckCircle2, HandHeart, X
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./supabase";

const TABLE_NAME = "au_welfare_contributions";

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(Number(amount || 0));

export default function App() {
  const [contributors, setContributors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadContributors() {
    if (!isSupabaseConfigured) {
      setError("Supabase is not configured. Add your project URL and anon key to the .env file.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from(TABLE_NAME)
      .select("id, member_name, amount_ksh, created_at")
      .order("id", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setContributors([]);
    } else {
      setContributors(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadContributors();
  }, []);

  const filteredContributors = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return contributors;

    return contributors.filter((person) =>
      person.member_name.toLocaleLowerCase().includes(query)
    );
  }, [contributors, search]);

  const totalAmount = contributors.reduce(
    (sum, person) => sum + Number(person.amount_ksh || 0), 0
  );

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="AU Welfare home">
          <span className="brand-mark">AU</span>
          <span>Welfare <small>CONTRIBUTION REGISTER</small></span>
        </a>
        <span className="live-label"><span /> Public register</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><HeartHandshake size={15} /> SESS YEAR 3</div>
          <h1>Standing together<br /><span>for Comrade Erick.</span></h1>
          <p>
            A record of contributions towards the send-off of
            Comrade Erick Makokha. Thank you to everyone who came together
            to show kindness and support.
          </p>
          <div className="hero-thanks"><HandHeart size={17} /> Every contribution is appreciated.</div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-circle circle-one" />
          <div className="art-circle circle-two" />
          <div className="art-icon"><HeartHandshake size={58} strokeWidth={1.35} /></div>
          <span className="art-star star-one">✳</span>
          <span className="art-star star-two">✦</span>
        </div>
      </section>

      <section className="stats" aria-label="Contribution summary">
        <article className="stat-card">
          <div className="stat-icon purple"><Users size={20} /></div>
          <div><span className="stat-label">Contributors</span><strong>{contributors.length}</strong><small>People who gave</small></div>
        </article>
        <article className="stat-card">
          <div className="stat-icon green"><Wallet size={20} /></div>
          <div><span className="stat-label">Total contributions</span><strong>{formatAmount(totalAmount)}</strong><small>Amount recorded</small></div>
        </article>
        <article className="stat-card">
          <div className="stat-icon orange"><HeartHandshake size={20} /></div>
          <div><span className="stat-label">Purpose</span><strong className="purpose-value">Erick's send-off</strong><small>SESS Year 3 Welfare</small></div>
        </article>
      </section>

      <section className="register-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">TRANSPARENCY & APPRECIATION</span>
            <h2>Contribution register</h2>
            <p>View the names and amounts contributed by your classmates.</p>
          </div>
          <button className="refresh-button" onClick={loadContributors} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>

        <div className="search-wrap">
          <Search size={19} />
          <input
            type="search"
            placeholder="Search your name or a contributor..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search contributors by name"
          />
          {search && <button className="clear-search" onClick={() => setSearch("")} aria-label="Clear search"><X size={17} /></button>}
        </div>

        {search && !loading && !error && (
          <div className="search-result">
            {filteredContributors.length
              ? `${filteredContributors.length} matching ${filteredContributors.length === 1 ? "record" : "records"}`
              : `No contributor found matching “${search}”.`}
          </div>
        )}

        {error ? (
          <div className="notice error-notice">
            <AlertCircle size={20} />
            <div><strong>Unable to load contributions</strong><p>{error}</p></div>
          </div>
        ) : loading ? (
          <div className="loading-state"><span className="loader" /> Loading contribution records...</div>
        ) : filteredContributors.length === 0 ? (
          <div className="empty-state">
            <Users size={30} />
            <strong>No contributors found</strong>
            <p>Try searching with a different name.</p>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Contributor</th><th className="amount-heading">Amount</th></tr></thead>
                <tbody>
                  {filteredContributors.map((person, index) => (
                    <tr key={person.id}>
                      <td className="number-cell">{index + 1}</td>
                      <td><span className="avatar">{person.member_name.trim().charAt(0).toUpperCase()}</span><span className="member-name">{person.member_name}</span></td>
                      <td className="amount-cell">{formatAmount(person.amount_ksh)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>Showing {filteredContributors.length} of {contributors.length} contributors</span>
              <span><CheckCircle2 size={15} /> Contribution records</span>
            </div>
          </>
        )}
      </section>

      <section className="closing-note">
        <div className="closing-icon"><HandHeart size={22} /></div>
        <div>
          <strong>Thank you for your kindness and solidarity.</strong>
          <p>Your support is sincerely appreciated. May God bless you all.</p>
        </div>
      </section>

      <footer>
        <span>AU Welfare · SESS Year 3</span>
        <span>In memory of Comrade Erick Makokha</span>
      </footer>
    </main>
  );
}
