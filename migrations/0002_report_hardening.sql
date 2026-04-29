alter table reports add column reporter_key text;
alter table reports add column subject_profile_url text;
alter table reports add column evidence_summary text;
alter table reports add column evidence_type text;
alter table reports add column contact_permission text not null default 'no';
alter table reports add column reviewer_name text;
alter table reports add column reviewer_confidence text;

create index if not exists idx_reports_reporter_key_created_at on reports(reporter_key, created_at desc);

create table if not exists moderation_events (
  id integer primary key autoincrement,
  report_id integer not null,
  action text not null,
  reviewer_note text,
  reviewer_name text,
  created_at text not null default (datetime('now')),
  foreign key(report_id) references reports(id)
);

create index if not exists idx_moderation_events_report_id_created_at on moderation_events(report_id, created_at desc);
