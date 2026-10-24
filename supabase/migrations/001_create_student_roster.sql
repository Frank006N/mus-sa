CREATE TABLE IF NOT EXISTS student_roster (
  reg_number TEXT PRIMARY KEY,
  surname TEXT NOT NULL,
  first_name TEXT NOT NULL,
  school_id UUID,
  department_id UUID,
  year_of_study INT NOT NULL CHECK (year_of_study BETWEEN 1 AND 6),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'graduated', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_roster_surname ON student_roster(surname);

ALTER TABLE student_roster ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Roster is server-only" ON student_roster
  FOR ALL USING (auth.role() = 'service_role');
