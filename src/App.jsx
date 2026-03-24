import { useState, useMemo } from "react";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_ALIASES = { "C#": "Db", "D#": "Eb", "F#": "Gb", "G#": "Ab", "A#": "Bb" };

const CHORD_TYPES = {
  "Majeur": [0, 4, 7],
  "Mineur": [0, 3, 7],
  "Dom 7": [0, 4, 7, 10],
  "Maj 7": [0, 4, 7, 11],
  "Min 7": [0, 3, 7, 10],
  "Sus2": [0, 2, 7],
  "Sus4": [0, 5, 7],
  "Dim": [0, 3, 6],
  "Aug": [0, 4, 8],
  "Add9": [0, 4, 7, 14],
  "6": [0, 4, 7, 9],
  "Min 6": [0, 3, 7, 9],
  "9": [0, 4, 7, 10, 14],
  "Dim 7": [0, 3, 6, 9],
  "Half-Dim": [0, 3, 6, 10],
};

function noteIndex(note) {
  const idx = NOTES.indexOf(note);
  if (idx !== -1) return idx;
  const entry = Object.entries(NOTE_ALIASES).find(([, v]) => v === note);
  return entry ? NOTES.indexOf(entry[0]) : -1;
}

function getChordNotes(root, intervals) {
  const rootIdx = noteIndex(root);
  return intervals.map(i => NOTES[(rootIdx + i) % 12]);
}

function noteLabel(note) {
  return NOTE_ALIASES[note] ? `${note}/${NOTE_ALIASES[note]}` : note;
}

function findChords(selectedNotes) {
  if (selectedNotes.length < 2) return [];
  const results = [];
  for (const root of NOTES) {
    for (const [type, intervals] of Object.entries(CHORD_TYPES)) {
      const chordNotes = getChordNotes(root, intervals);
      const sel = [...selectedNotes].sort();
      const chord = [...chordNotes].sort();
      if (sel.length === chord.length && sel.every((n, i) => n === chord[i])) {
        results.push({ root, type, notes: chordNotes });
      }
    }
  }
  return results;
}

const BLACK_KEY_POSITIONS = { 1: 1, 3: 2, 6: 4, 8: 5, 10: 6 };
const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];

export default function App() {
  const [mode, setMode] = useState("chord-to-notes");
  const [selectedRoot, setSelectedRoot] = useState("C");
  const [selectedType, setSelectedType] = useState("Majeur");
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [hoveredNote, setHoveredNote] = useState(null);

  const chordNotes = useMemo(
    () => getChordNotes(selectedRoot, CHORD_TYPES[selectedType]),
    [selectedRoot, selectedType]
  );

  const foundChords = useMemo(() => findChords(selectedNotes), [selectedNotes]);

  const activeNotes = mode === "chord-to-notes" ? chordNotes : selectedNotes;

  function toggleNote(note) {
    setSelectedNotes(prev =>
      prev.includes(note) ? prev.filter(n => n !== note) : [...prev, note]
    );
  }

  const allNoteLabels = NOTES.flatMap(n => NOTE_ALIASES[n] ? [n, NOTE_ALIASES[n]] : [n]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#e8e0d0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px",
      backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(180,120,60,0.07) 0%, transparent 60%), 
                        radial-gradient(ellipse at 80% 20%, rgba(80,60,180,0.07) 0%, transparent 50%)`,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Playfair+Display:wght@700;900&display=swap');
        * { box-sizing: border-box; }
        .mode-btn { transition: all 0.2s ease; cursor: pointer; border: none; }
        .mode-btn:hover { opacity: 0.85; }
        .note-pill { transition: all 0.15s ease; cursor: pointer; }
        .note-pill:hover { transform: translateY(-1px); }
        .piano-key { transition: all 0.1s ease; cursor: pointer; }
        .piano-key:hover { filter: brightness(1.15); }
        .result-card { transition: all 0.2s ease; }
        .result-card:hover { transform: translateX(4px); }
        select { background: #1a1820; color: #e8e0d0; border: 1px solid #3a3040; border-radius: 8px; padding: 10px 14px; font-family: inherit; font-size: 14px; cursor: pointer; outline: none; appearance: none; }
        select:focus { border-color: #c8982a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #1a1820; }
        ::-webkit-scrollbar-thumb { background: #3a3040; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: 11, letterSpacing: 6, color: "#c8982a", textTransform: "uppercase", marginBottom: 10 }}>
          Harmony Explorer
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 900,
          margin: 0,
          background: "linear-gradient(135deg, #e8e0d0 30%, #c8982a 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-1px",
        }}>
          Chord Finder
        </h1>
      </div>

      {/* Mode Toggle */}
      <div style={{
        display: "flex",
        background: "#14121a",
        borderRadius: 12,
        padding: 4,
        marginBottom: 40,
        border: "1px solid #2a2535",
        gap: 4,
      }}>
        {["chord-to-notes", "notes-to-chord"].map(m => (
          <button
            key={m}
            className="mode-btn"
            onClick={() => { setMode(m); setSelectedNotes([]); }}
            style={{
              padding: "10px 22px",
              borderRadius: 9,
              fontSize: 13,
              fontFamily: "inherit",
              background: mode === m ? "#c8982a" : "transparent",
              color: mode === m ? "#0a0a0f" : "#9090a0",
              fontWeight: mode === m ? 500 : 400,
              letterSpacing: 0.3,
            }}
          >
            {m === "chord-to-notes" ? "Accord → Notes" : "Notes → Accord"}
          </button>
        ))}
      </div>

      {/* Main Panel */}
      <div style={{
        width: "100%",
        maxWidth: 680,
        background: "#100e16",
        border: "1px solid #2a2535",
        borderRadius: 20,
        padding: "32px",
        marginBottom: 32,
      }}>
        {mode === "chord-to-notes" ? (
          <>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#666", textTransform: "uppercase", marginBottom: 20 }}>
              Sélectionner l'accord
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
              {/* Root selector */}
              <div style={{ position: "relative" }}>
                <select value={selectedRoot} onChange={e => setSelectedRoot(e.target.value)} style={{ minWidth: 100 }}>
                  {NOTES.map(n => (
                    <option key={n} value={n}>{noteLabel(n)}</option>
                  ))}
                </select>
                <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#c8982a", pointerEvents: "none", fontSize: 10 }}>▼</div>
              </div>
              {/* Type selector */}
              <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
                <select value={selectedType} onChange={e => setSelectedType(e.target.value)} style={{ width: "100%" }}>
                  {Object.keys(CHORD_TYPES).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#c8982a", pointerEvents: "none", fontSize: 10 }}>▼</div>
              </div>
            </div>

            {/* Result */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, letterSpacing: 4, color: "#666", textTransform: "uppercase", marginBottom: 14 }}>
                Notes de l'accord
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {chordNotes.map((note, i) => (
                  <div key={i} style={{
                    background: i === 0 ? "rgba(200,152,42,0.2)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${i === 0 ? "#c8982a" : "#3a3040"}`,
                    borderRadius: 10,
                    padding: "10px 20px",
                    fontSize: 18,
                    fontWeight: 500,
                    color: i === 0 ? "#c8982a" : "#e8e0d0",
                    fontFamily: "'Playfair Display', serif",
                  }}>
                    {noteLabel(note)}
                    <span style={{ fontSize: 10, color: "#666", marginLeft: 6, fontFamily: "inherit" }}>
                      {i === 0 ? "root" : `+${CHORD_TYPES[selectedType][i]}st`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#666", textTransform: "uppercase", marginBottom: 16 }}>
              Sélectionner les notes ({selectedNotes.length} sélectionnée{selectedNotes.length > 1 ? "s" : ""})
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {NOTES.map(note => {
                const active = selectedNotes.includes(note);
                return (
                  <button
                    key={note}
                    className="note-pill"
                    onClick={() => toggleNote(note)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: `1px solid ${active ? "#c8982a" : "#3a3040"}`,
                      background: active ? "rgba(200,152,42,0.18)" : "transparent",
                      color: active ? "#c8982a" : "#7070808",
                      fontFamily: "inherit",
                      fontSize: 14,
                      cursor: "pointer",
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    {noteLabel(note)}
                  </button>
                );
              })}
            </div>

            {selectedNotes.length >= 2 && (
              <>
                <div style={{ fontSize: 11, letterSpacing: 4, color: "#666", textTransform: "uppercase", marginBottom: 14 }}>
                  Accords trouvés {foundChords.length === 0 && <span style={{ color: "#ff6060", textTransform: "none", letterSpacing: 0 }}>— aucune correspondance</span>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {foundChords.map((chord, i) => (
                    <div key={i} className="result-card" style={{
                      background: "rgba(200,152,42,0.06)",
                      border: "1px solid rgba(200,152,42,0.25)",
                      borderRadius: 12,
                      padding: "14px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      <div>
                        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#c8982a" }}>{noteLabel(chord.root)}</span>
                        <span style={{ fontSize: 14, color: "#9090a0", marginLeft: 8 }}>{chord.type}</span>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        {chord.notes.map((n, j) => (
                          <span key={j} style={{ fontSize: 12, color: "#c0b8a8", background: "#1e1c28", padding: "3px 8px", borderRadius: 5 }}>{noteLabel(n)}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Piano Keyboard */}
      <div style={{
        background: "#100e16",
        border: "1px solid #2a2535",
        borderRadius: 20,
        padding: "28px 32px 24px",
        width: "100%",
        maxWidth: 680,
      }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#666", textTransform: "uppercase", marginBottom: 20 }}>
          Clavier
        </div>
        <div style={{ position: "relative", height: 130, display: "flex", justifyContent: "center" }}>
          {/* White keys */}
          <div style={{ display: "flex", gap: 3 }}>
            {WHITE_KEYS.map((noteIdx, i) => {
              const note = NOTES[noteIdx];
              const isActive = activeNotes.includes(note);
              const isHovered = hoveredNote === note;
              return (
                <div
                  key={noteIdx}
                  className="piano-key"
                  onClick={() => mode === "notes-to-chord" && toggleNote(note)}
                  onMouseEnter={() => setHoveredNote(note)}
                  onMouseLeave={() => setHoveredNote(null)}
                  style={{
                    width: 52,
                    height: 120,
                    background: isActive ? "linear-gradient(to bottom, #e8c870, #c8982a)" : isHovered ? "#f0e8d8" : "#f5f0e8",
                    borderRadius: "0 0 8px 8px",
                    border: isActive ? "1px solid #c8982a" : "1px solid #d0c8b8",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingBottom: 8,
                    fontSize: 11,
                    color: isActive ? "#3a2000" : "#999",
                    fontWeight: isActive ? 600 : 400,
                    boxShadow: isActive ? "0 0 20px rgba(200,152,42,0.4)" : "0 4px 12px rgba(0,0,0,0.5)",
                    cursor: mode === "notes-to-chord" ? "pointer" : "default",
                  }}
                >
                  {isActive || isHovered ? note : ""}
                </div>
              );
            })}
          </div>

          {/* Black keys */}
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 7 * 55, display: "flex" }}>
            {NOTES.map((note, noteIdx) => {
              const blackPos = BLACK_KEY_POSITIONS[noteIdx];
              if (blackPos === undefined) return null;
              const isActive = activeNotes.includes(note);
              const isHovered = hoveredNote === note;
              return (
                <div
                  key={noteIdx}
                  className="piano-key"
                  onClick={() => mode === "notes-to-chord" && toggleNote(note)}
                  onMouseEnter={() => setHoveredNote(note)}
                  onMouseLeave={() => setHoveredNote(null)}
                  style={{
                    position: "absolute",
                    left: (blackPos - 1) * 55 + 35,
                    width: 34,
                    height: 76,
                    background: isActive ? "linear-gradient(to bottom, #c8982a, #7a5a10)" : isHovered ? "#3a3040" : "#1a1520",
                    borderRadius: "0 0 6px 6px",
                    zIndex: 2,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingBottom: 6,
                    fontSize: 9,
                    color: isActive ? "#fff" : "#666",
                    fontWeight: isActive ? 600 : 400,
                    boxShadow: isActive ? "0 0 16px rgba(200,152,42,0.5)" : "0 4px 10px rgba(0,0,0,0.8)",
                    cursor: mode === "notes-to-chord" ? "pointer" : "default",
                    border: isActive ? "1px solid rgba(200,152,42,0.6)" : "none",
                  }}
                >
                  {isActive || isHovered ? noteLabel(note) : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28, fontSize: 11, color: "#3a3545", letterSpacing: 2 }}>
        {NOTES.length} notes · {Object.keys(CHORD_TYPES).length} types d'accords
      </div>
    </div>
  );
}
