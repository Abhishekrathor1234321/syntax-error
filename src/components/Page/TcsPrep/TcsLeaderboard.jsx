import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
// TODO: production me deploy karte waqt yahan backend ka live URL daalo
const API_BASE = "https://syntax-error-1xds.vercel.app";

const [myRank, setMyRank] = useState(null);
const [myUser, setMyUser] = useState(null);

const TABS = [
  { key: "overall", label: "Overall" },
  { key: "coding", label: "Coding" },
  { key: "aptitude", label: "Aptitude" },
  { key: "cshr", label: "CS + HR + GenAI" },
];

const VALID_KEYS = TABS.map((t) => t.key);
const MEDALS = ["🥇", "🥈", "🥉"];

export default function TcsLeaderboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlType = searchParams.get("type");
  const [activeTab, setActiveTab] = useState(VALID_KEYS.includes(urlType) ? urlType : "overall");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  setLoading(true);
  setError("");

  // Current logged-in user
  let currentUserId = "";

  try {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    currentUserId =
      parsedUser?._id ||
      parsedUser?.id ||
      parsedUser?.userId ||
      "";
  } catch (error) {
    console.error("Unable to read user from localStorage:", error);
  }

  const url =
    `${API_BASE}/tcs/leaderboard?category=${activeTab}` +
    (currentUserId
      ? `&userId=${encodeURIComponent(currentUserId)}`
      : "");

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setLeaderboard(data.leaderboard || []);
        setMyUser(data.currentUser || null);
        setMyRank(data.currentUser?.rank || null);
      } else {
        setError(data.message || "Leaderboard load nahi ho paaya");
      }

      setLoading(false);
    })
    .catch(() => {
      setError("Server se connect nahi ho paya");
      setLoading(false);
    });
}, [activeTab]);

  return (
    <div className="tcslb-wrap">
      <style>{`
        .tcslb-wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 2.5rem 1.25rem 4rem;
        }
        .tcslb-head { text-align: center; margin-bottom: 1.75rem; }
        .tcslb-head h1 {
          font-size: clamp(1.6rem, 4vw, 2.2rem);
          margin: 0 0 0.4rem;
        }
        .tcslb-head p { color: #94a3b8; margin: 0; }

        .tcslb-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .tcslb-tab {
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid #334155;
          background: transparent;
          color: inherit;
          cursor: pointer;
          font-size: 0.9rem;
          white-space: nowrap;
          transition: background 0.15s, color 0.15s;
        }
        .tcslb-tab.active {
          background: #111827;
          color: #fff;
          border-color: #111827;
        }

        .tcslb-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
        }
        .tcslb-row {
          display: grid;
          grid-template-columns: 56px 1fr 90px;
          align-items: center;
          padding: 12px 18px;
          border-bottom: 1px solid #f1f5f9;
        }
        .tcslb-row:last-child { border-bottom: none; }
        .tcslb-row.head {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          background: #f8fafc;
        }
        .tcslb-row.me { background: #ecfdf5; }
        .tcslb-rank { font-weight: 700; }
        .tcslb-points { text-align: right; font-weight: 600; }
        .tcslb-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .tcslb-empty, .tcslb-loading, .tcslb-error {
          text-align: center;
          padding: 2.5rem 1rem;
          color: #94a3b8;
        }
        .tcslb-error { color: #ef4444; }
         
        .tcslb-my-rank {
  margin-top: 16px;
}

.tcslb-my-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tcslb-my-rank .tcslb-row {
  border: 1px solid #f9a8d4;
  border-radius: 12px;
  background: #fff1f2;
}

.tcslb-row.me {
  background: #fff1f2;
}





        @media (max-width: 480px) {
          .tcslb-row { grid-template-columns: 40px 1fr 70px; padding: 10px 12px; }
          .tcslb-tab { font-size: 0.8rem; padding: 6px 12px; }
        }
      `}</style>

      <div className="tcslb-head">
        <h1>🏆 TCS Prep Leaderboard</h1>
        <p>See who's leading in each section.</p>
      </div>

      <div className="tcslb-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tcslb-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => {
              setActiveTab(tab.key);
              setSearchParams(tab.key === "overall" ? {} : { type: tab.key });
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="tcslb-loading">Loading...</p>}
      {error && <p className="tcslb-error">{error}</p>}

      {!loading && !error && leaderboard.length === 0 && (
        <p className="tcslb-empty">No one has scored any points here yet — be the first!</p>
      )}

     {!loading && leaderboard.length > 0 && (
  <>
    {/* TOP 10 LEADERBOARD */}
    <div className="tcslb-card">
      <div className="tcslb-row head">
        <span>Rank</span>
        <span>Name</span>
        <span className="tcslb-points">Points</span>
      </div>

      {leaderboard.map((row) => (
        <div
          className={`tcslb-row ${
            myRank === row.rank ? "me" : ""
          }`}
          key={row.rank}
        >
          <span className="tcslb-rank">
            {MEDALS[row.rank - 1] || `#${row.rank}`}
          </span>

          <span className="tcslb-name">
            {row.name}
          </span>

          <span className="tcslb-points">
            {row.points}
          </span>
        </div>
      ))}
    </div>

    {/* CURRENT USER RANK - ONLY IF OUTSIDE TOP 10 */}
    {myRank > 10 && myUser && (
      <div className="tcslb-my-rank">
        <div className="tcslb-my-title">
          Your Current Rank
        </div>

        <div className="tcslb-row me">
          <span className="tcslb-rank">
            #{myRank}
          </span>

          <span className="tcslb-name">
            {myUser.name}
          </span>

          <span className="tcslb-points">
            {myUser.points}
          </span>
        </div>
      </div>
    )}
  </>
)}
    </div>
  );
}