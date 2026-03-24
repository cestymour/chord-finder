import { useState, useMemo } from "react";
import "./App.css";

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

  return (
    <div className="app">
      {/* Header */}
      <div className="app-header">
        <div className="app-kicker">Harmony Explorer</div>
        <h1 className="app-title">Chord Finder</h1>
      </div>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        {["chord-to-notes", "notes-to-chord"].map(m => (
          <button
            key={m}
            type="button"
            className={`mode-btn${mode === m ? " mode-btn--active" : ""}`}
            onClick={() => {
              setMode(m);
              setSelectedNotes([]);
            }}
          >
            {m === "chord-to-notes" ? "Accord → Notes" : "Notes → Accord"}
          </button>
        ))}
      </div>

      {/* Main Panel */}
      <div className="main-panel">
        {mode === "chord-to-notes" ? (
          <>
            <div className="section-label section-label--mb-20">Sélectionner l'accord</div>
            <div className="select-row">
              <div className="select-wrap">
                <select
                  className="select--min-w"
                  value={selectedRoot}
                  onChange={e => setSelectedRoot(e.target.value)}
                >
                  {NOTES.map(n => (
                    <option key={n} value={n}>
                      {noteLabel(n)}
                    </option>
                  ))}
                </select>
                <div className="select-chevron">▼</div>
              </div>
              <div className="select-wrap select-wrap--grow">
                <select className="select--full" value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                  {Object.keys(CHORD_TYPES).map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <div className="select-chevron">▼</div>
              </div>
            </div>

            <div className="chord-notes-block">
              <div className="section-label section-label--mb-14">Notes de l'accord</div>
              <div className="chord-notes-row">
                {chordNotes.map((note, i) => (
                  <div key={i} className={`note-result${i === 0 ? " note-result--root" : ""}`}>
                    {noteLabel(note)}
                    <span className="note-result-meta">
                      {i === 0 ? "root" : `+${CHORD_TYPES[selectedType][i]}st`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="section-label section-label--mb-16">
              Sélectionner les notes ({selectedNotes.length} sélectionnée{selectedNotes.length > 1 ? "s" : ""})
            </div>
            <div className="note-pills-row">
              {NOTES.map(note => {
                const active = selectedNotes.includes(note);
                return (
                  <button
                    key={note}
                    type="button"
                    className={`note-pill${active ? " note-pill--active" : ""}`}
                    onClick={() => toggleNote(note)}
                  >
                    {noteLabel(note)}
                  </button>
                );
              })}
            </div>

            {selectedNotes.length >= 2 && (
              <>
                <div className="section-label section-label--mb-14 found-section-label">
                  Accords trouvés{" "}
                  {foundChords.length === 0 && (
                    <span className="found-empty">— aucune correspondance</span>
                  )}
                </div>
                <div className="results-list">
                  {foundChords.map((chord, i) => (
                    <div key={i} className="result-card">
                      <div>
                        <span className="result-card__root">{noteLabel(chord.root)}</span>
                        <span className="result-card__type">{chord.type}</span>
                      </div>
                      <div className="result-card__notes">
                        {chord.notes.map((n, j) => (
                          <span key={j} className="result-card__note-chip">
                            {noteLabel(n)}
                          </span>
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
      <div className="piano-section">
        <div className="section-label section-label--mb-20">Clavier</div>
        <div className="piano-rack">
          <div className="white-keys-row">
            {WHITE_KEYS.map(noteIdx => {
              const note = NOTES[noteIdx];
              const isActive = activeNotes.includes(note);
              const isHovered = hoveredNote === note;
              const interactive = mode === "notes-to-chord";
              return (
                <div
                  key={noteIdx}
                  className={[
                    "piano-key",
                    "white-key",
                    isActive && "white-key--active",
                    !isActive && isHovered && "white-key--hover",
                    interactive ? "piano-key--interactive" : "piano-key--default-cursor",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => mode === "notes-to-chord" && toggleNote(note)}
                  onMouseEnter={() => setHoveredNote(note)}
                  onMouseLeave={() => setHoveredNote(null)}
                >
                  {isActive || isHovered ? note : ""}
                </div>
              );
            })}
          </div>

          <div className="black-keys-layer">
            {NOTES.map((note, noteIdx) => {
              const blackPos = BLACK_KEY_POSITIONS[noteIdx];
              if (blackPos === undefined) return null;
              const isActive = activeNotes.includes(note);
              const isHovered = hoveredNote === note;
              const interactive = mode === "notes-to-chord";
              return (
                <div
                  key={noteIdx}
                  className={[
                    "piano-key",
                    "black-key",
                    isActive && "black-key--active",
                    !isActive && isHovered && "black-key--hover",
                    interactive ? "piano-key--interactive" : "piano-key--default-cursor",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{ left: (blackPos - 1) * 55 + 35 }}
                  onClick={() => mode === "notes-to-chord" && toggleNote(note)}
                  onMouseEnter={() => setHoveredNote(note)}
                  onMouseLeave={() => setHoveredNote(null)}
                >
                  {isActive || isHovered ? noteLabel(note) : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="app-footer">
        {NOTES.length} notes · {Object.keys(CHORD_TYPES).length} types d'accords
      </div>
    </div>
  );
}
