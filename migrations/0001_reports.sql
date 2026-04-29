create table if not exists reports (
  id integer primary key autoincrement,
  reporter_email text not null,
  organization text not null default '',
  subject_name text not null,
  source_url text not null default '',
  narrative text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at text not null default (datetime('now')),
  reviewed_at text,
  reviewer_note text not null default ''
);

create index if not exists idx_reports_status_created_at on reports(status, created_at desc);
