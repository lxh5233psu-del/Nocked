# data-models.md
# Nocked — Data Models (SQLite Schema)

---

## archer_profile
```sql
CREATE TABLE archer_profile (
  id TEXT PRIMARY KEY,              -- persistent local UUID (generateId())
  name TEXT,
  handedness TEXT NOT NULL,         -- 'RH' | 'LH'
  experience TEXT NOT NULL,         -- 'beginner' | 'intermediate' | 'advanced' | 'pro'
  discipline TEXT NOT NULL,         -- 'target' | 'hunting' | 'both'
  units TEXT NOT NULL DEFAULT 'imperial', -- 'imperial' | 'metric'
  form_reminders INTEGER DEFAULT 1, -- 0 | 1
  form_reminder_frequency TEXT DEFAULT 'every_session',
  -- Phase 2: social profile fields
  bio TEXT,                         -- short user bio (optional)
  preferred_bow_type TEXT,          -- 'Compound' | 'Recurve' | 'Traditional' | 'Crossbow'
  avatar_uri TEXT,                  -- local image URI (optional)
  is_public INTEGER NOT NULL DEFAULT 1, -- 0 | 1 — public by default
  created_at TEXT NOT NULL
);
```

---

## Phase 2: Social Graph Tables

### social_follow
```sql
CREATE TABLE social_follow (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL REFERENCES archer_profile(id),   -- who is following
  following_id TEXT NOT NULL REFERENCES archer_profile(id),  -- who is being followed
  created_at INTEGER NOT NULL,      -- Unix timestamp ms
  UNIQUE (follower_id, following_id)
);
CREATE INDEX idx_social_follow_follower ON social_follow(follower_id);
CREATE INDEX idx_social_follow_following ON social_follow(following_id);
```

### session_like
```sql
CREATE TABLE session_like (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES scoring_session(id) ON DELETE CASCADE,
  archer_id TEXT NOT NULL REFERENCES archer_profile(id),
  created_at INTEGER NOT NULL,      -- Unix timestamp ms
  UNIQUE (session_id, archer_id)
);
CREATE INDEX idx_session_like_session ON session_like(session_id);
```

### session_comment
```sql
CREATE TABLE session_comment (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES scoring_session(id) ON DELETE CASCADE,
  archer_id TEXT NOT NULL REFERENCES archer_profile(id),
  archer_name TEXT NOT NULL,        -- denormalised for display (avoids join in feed)
  text TEXT NOT NULL,               -- max 280 chars enforced in app
  created_at INTEGER NOT NULL       -- Unix timestamp ms
);
CREATE INDEX idx_session_comment_session ON session_comment(session_id);
```

> **Join path for the activity feed:**
> ```sql
> SELECT ss.*
> FROM scoring_session ss
> WHERE ss.archer_id IN (
>   SELECT following_id FROM social_follow WHERE follower_id = :myId
>   UNION SELECT :myId
> )
> AND ss.completed = 1
> AND ss.is_shared = 1
> ORDER BY ss.created_at DESC
> LIMIT :pageSize OFFSET :offset;
> ```
> This is the query to migrate to once Supabase is live. The current local implementation
> reproduces the same logic in `useSocialStore.buildFeedSlice()`.

---

### scoring_session (Phase 2 additions)
```sql
-- New columns added to existing scoring_session table:
ALTER TABLE scoring_session ADD COLUMN archer_id TEXT REFERENCES archer_profile(id);
ALTER TABLE scoring_session ADD COLUMN is_shared INTEGER NOT NULL DEFAULT 1; -- 0 | 1
ALTER TABLE scoring_session ADD COLUMN avg_per_target REAL; -- stored at save time
```

> **CRITICAL:** `avg_per_target` = `total_score ÷ total_units`, stored once at session save.
> Never recomputed on read. Same rule applies to the Zustand store (`addScoringRound`
> stamps both `archerId` and `avgPerTarget`).

---

## Current implementation note (MVP Phase 2)
The social tables above reflect the **target SQLite / Supabase schema**. In the current
build, all social state (`follows`, `likes`, `comments`) is stored in Zustand persisted
via AsyncStorage (`nocked-social-storage` key), matching the same data shape. Migration
to Supabase in Phase 3 only requires pointing the store actions at remote calls — the
type signatures and business logic remain unchanged.

## bow_profile
```sql
CREATE TABLE bow_profile (
  id INTEGER PRIMARY KEY,
  archer_id INTEGER NOT NULL REFERENCES archer_profile(id),
  nickname TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  draw_weight REAL,
  draw_length REAL,
  rest_type TEXT,       -- 'drop_cable' | 'drop_limb' | 'full_capture' | 'shoot_through'
  rest_manufacturer TEXT,
  rest_model TEXT,
  sight_type TEXT,      -- 'single_pin' | 'multi_pin'
  sight_manufacturer TEXT,
  sight_model TEXT,
  limb_bolt_turns REAL,
  brace_height REAL,
  axle_to_axle REAL,
  is_active INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);
```

## arrow_profile
```sql
CREATE TABLE arrow_profile (
  id INTEGER PRIMARY KEY,
  bow_id INTEGER NOT NULL REFERENCES bow_profile(id),
  manufacturer TEXT,
  model TEXT,
  length REAL,
  spine TEXT,
  point_weight REAL,
  nock_type TEXT,
  fletching_type TEXT,
  vane_config TEXT,
  created_at TEXT NOT NULL
);
```

## release_profile
```sql
CREATE TABLE release_profile (
  id INTEGER PRIMARY KEY,
  archer_id INTEGER NOT NULL REFERENCES archer_profile(id),
  type TEXT NOT NULL,   -- 'wrist' | 'thumb' | 'hinge' | 'back_tension' | 'other'
  brand TEXT,
  model TEXT,
  created_at TEXT NOT NULL
);
```

## tool_inventory
```sql
CREATE TABLE tool_inventory (
  id INTEGER PRIMARY KEY,
  archer_id INTEGER NOT NULL REFERENCES archer_profile(id),
  tool_key TEXT NOT NULL  -- matches constant key from tools list
);
```

---

## Bow Database (read-only seed data)

## bow_database
```sql
CREATE TABLE bow_database (
  id INTEGER PRIMARY KEY,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  draw_weight_min REAL,
  draw_weight_max REAL,
  draw_length_min REAL,
  draw_length_max REAL,
  brace_height_min REAL,
  brace_height_max REAL,
  axle_to_axle REAL,
  cam_system TEXT,
  let_off_pct REAL,
  mass_weight REAL,
  ibo_speed INTEGER,
  limb_bolt_max_turns REAL,
  lbs_per_turn REAL,
  string_length REAL,
  cable_length REAL,
  cam_shim_system INTEGER DEFAULT 0,  -- 0 | 1
  cam_shim_instructions TEXT,
  limb_pocket_adjust INTEGER DEFAULT 0,
  limb_pocket_instructions TEXT,
  bow_press_required INTEGER DEFAULT 0
);
```

## bow_module_map
```sql
CREATE TABLE bow_module_map (
  id INTEGER PRIMARY KEY,
  bow_database_id INTEGER NOT NULL REFERENCES bow_database(id),
  module_position TEXT NOT NULL,   -- e.g. '1', '2', 'A', 'B'
  draw_length REAL NOT NULL
);
```

## sight_database
```sql
CREATE TABLE sight_database (
  id INTEGER PRIMARY KEY,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  mount_type TEXT,  -- 'universal' | 'picatinny' | 'dovetail' | 'through_mount'
  first_axis_instructions TEXT,
  second_axis_instructions TEXT,
  third_axis_instructions TEXT,
  has_built_in_level INTEGER DEFAULT 0,
  has_vertical_slider INTEGER DEFAULT 0
);
```

## rest_database
```sql
CREATE TABLE rest_database (
  id INTEGER PRIMARY KEY,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  rest_type TEXT NOT NULL,
  cord_attachment_method TEXT,
  horizontal_range REAL,
  vertical_range REAL
);
```

## target_database
```sql
CREATE TABLE target_database (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  manufacturer TEXT,
  category TEXT,  -- 'big_game' | 'small_game' | 'predator' | 'exotic' | 'reptile' | 'aquatic' | 'fantasy'
  silhouette_svg TEXT NOT NULL,   -- asset path
  ring_zoom_svg TEXT NOT NULL,    -- asset path
  compatible_standards TEXT       -- JSON array: ['asa','ibo','nfaa','kwm']
);
```

---

## Scoring

## scoring_session
```sql
CREATE TABLE scoring_session (
  id INTEGER PRIMARY KEY,
  archer_id INTEGER NOT NULL REFERENCES archer_profile(id),
  bow_id INTEGER REFERENCES bow_profile(id),
  course_id INTEGER REFERENCES course(id),   -- null if no saved course
  session_name TEXT,
  location TEXT,
  round_type TEXT NOT NULL,     -- 'indoor' | 'outdoor' | '3d' | 'field' | 'custom'
  format TEXT NOT NULL,         -- 'asa' | 'ibo' | 'vegas' | 'kwm' | 'custom' etc.
  scoring_config TEXT,          -- JSON — custom scoring ring definitions
  session_structure TEXT NOT NULL, -- 'ends' | 'targets'
  arrows_per_unit INTEGER NOT NULL,
  total_units INTEGER NOT NULL,
  total_score REAL,
  avg_per_target REAL,          -- STORED at save time — total_score / total_units
  x_count INTEGER DEFAULT 0,
  miss_count INTEGER DEFAULT 0,
  kill_count INTEGER,           -- KWM only
  wound_count INTEGER,          -- KWM only
  completed INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  completed_at TEXT
);
```

## scoring_session_shooter
```sql
CREATE TABLE scoring_session_shooter (
  id INTEGER PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES scoring_session(id),
  name TEXT NOT NULL,
  bow_class TEXT NOT NULL,
  total_score REAL,
  avg_per_target REAL,
  x_count INTEGER DEFAULT 0,
  is_primary_user INTEGER DEFAULT 0
);
```

## scoring_end
```sql
CREATE TABLE scoring_end (
  id INTEGER PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES scoring_session(id),
  shooter_id INTEGER NOT NULL REFERENCES scoring_session_shooter(id),
  unit_number INTEGER NOT NULL,   -- end number or target number
  target_id INTEGER REFERENCES target_database(id),
  target_name TEXT,               -- custom name from course
  yardage REAL,
  scores TEXT NOT NULL,           -- JSON array of arrow scores e.g. [10, 'X', 8]
  end_total REAL NOT NULL,
  x_count INTEGER DEFAULT 0,
  photo_uri TEXT,
  notes TEXT,
  arrow_plot TEXT,                -- JSON: array of {x, y, score} impact positions
  created_at TEXT NOT NULL
);
```

## course
```sql
CREATE TABLE course (
  id INTEGER PRIMARY KEY,
  archer_id INTEGER NOT NULL REFERENCES archer_profile(id),
  name TEXT NOT NULL,
  location TEXT,
  target_count INTEGER NOT NULL,
  scoring_standard TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## course_target
```sql
CREATE TABLE course_target (
  id INTEGER PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES course(id),
  target_number INTEGER NOT NULL,
  custom_name TEXT,
  target_database_id INTEGER REFERENCES target_database(id),
  yardage REAL,
  notes TEXT,
  difficulty TEXT   -- 'easy' | 'medium' | 'hard'
);
```

## scorer_roster
```sql
CREATE TABLE scorer_roster (
  id INTEGER PRIMARY KEY,
  archer_id INTEGER NOT NULL REFERENCES archer_profile(id),
  name TEXT NOT NULL,
  bow_class TEXT NOT NULL,
  created_at TEXT NOT NULL
);
```

---

## Tuning

## tuning_session
```sql
CREATE TABLE tuning_session (
  id INTEGER PRIMARY KEY,
  archer_id INTEGER NOT NULL REFERENCES archer_profile(id),
  bow_id INTEGER NOT NULL REFERENCES bow_profile(id),
  method TEXT NOT NULL,     -- 'paper' | 'walkback' | 'bare_shaft' | 'broadhead' | 'group' etc.
  notes TEXT,
  rest_position_h REAL,     -- horizontal rest position at end of session
  rest_position_v REAL,     -- vertical rest position at end of session
  result TEXT,              -- JSON — method-specific result data
  created_at TEXT NOT NULL
);
```

---

## Shot Analyzer

## shot_analysis
```sql
CREATE TABLE shot_analysis (
  id INTEGER PRIMARY KEY,
  archer_id INTEGER NOT NULL REFERENCES archer_profile(id),
  bow_id INTEGER REFERENCES bow_profile(id),
  video_uri TEXT NOT NULL,
  phase_markers TEXT,       -- JSON: {setup, draw, anchor, aim, release, follow_through} frame timestamps
  responses TEXT,           -- JSON: guided question answers per component
  results TEXT,             -- JSON: per-component status + feedback
  notes TEXT,
  created_at TEXT NOT NULL
);
```

---

## Key Data Notes
- `avg_per_target` MUST be calculated and stored at session save time — never computed on the fly
- `arrow_plot` stored as JSON array of `{x: number, y: number, score: string|number}` per impact
- `scoring_config` for custom formats stored as JSON — ring definitions array
- `phase_markers` in shot_analysis stored as JSON frame index map
- `course_id` on `scoring_session` links Performance Overview course-specific trends — must always be set when scoring a saved course
