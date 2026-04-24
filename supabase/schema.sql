-- ============================================================
-- Gammaprep Supabase Schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";


-- ============================================================
-- PROFILES
-- Mirrors auth.users; created automatically via trigger
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null default '',
  phone       text,
  is_admin    boolean not null default false,
  onboarding_done boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Trigger: auto-create profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Helper: security definer avoids RLS recursion when checking admin status
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());


-- ============================================================
-- PRODUCTS
-- Seeded with 3 rows; prices editable via admin settings
-- ============================================================
create table if not exists public.products (
  id             uuid primary key default uuid_generate_v4(),
  slug           text unique not null,
  name           text not null,
  price_inr      integer not null,
  original_price integer,
  features       jsonb,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- Seed products
insert into public.products (slug, name, price_inr, original_price, features) values
(
  'career_audit',
  'Career Audit',
  499,
  999,
  '["Resume deep-dive by industry expert","LinkedIn profile optimisation","Personalised feedback report PDF","Shortlisting gap analysis","Priority email support"]'::jsonb
),
(
  'interview_sprint',
  'Interview Sprint',
  9999,
  14999,
  '["14–21 day structured prep roadmap","Weekly group coaching sessions","2 live mock interviews with feedback","DSA + system design resources","Slack community access","Recording library"]'::jsonb
),
(
  'placement_mentorship',
  'Placement Mentorship',
  29999,
  49999,
  '["Everything in Interview Sprint","Weekly 1:1 mentorship calls","Unlimited mock interviews","Job application tracking & strategy","Referral introductions to our network","Priority WhatsApp support","Offer negotiation coaching"]'::jsonb
)
on conflict (slug) do nothing;

-- No RLS needed - products are public
alter table public.products enable row level security;
create policy "Products are publicly readable"
  on public.products for select using (true);


-- ============================================================
-- ONBOARDING RESPONSES
-- ============================================================
create table if not exists public.onboarding_responses (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid unique not null references public.profiles(id) on delete cascade,
  "current_role"      text,
  current_company     text,
  target_companies    text[],
  target_role         text,
  biggest_challenge   text check (biggest_challenge in (
                        'resume_not_shortlisted',
                        'interview_rejections',
                        'no_clarity_on_prep'
                      )),
  recommended_product text check (recommended_product in (
                        'career_audit',
                        'interview_sprint',
                        'placement_mentorship'
                      )),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.onboarding_responses enable row level security;

create policy "Users can manage their own onboarding"
  on public.onboarding_responses for all
  using (auth.uid() = user_id);

create policy "Admins can read all onboarding"
  on public.onboarding_responses for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- ============================================================
-- PROMO CODES
-- ============================================================
create table if not exists public.promo_codes (
  id           uuid primary key default uuid_generate_v4(),
  code         text unique not null,
  discount_pct integer not null check (discount_pct > 0 and discount_pct <= 100),
  max_uses     integer,
  used_count   integer not null default 0,
  is_active    boolean not null default true,
  valid_from   timestamptz,
  valid_until  timestamptz,
  product_id   uuid references public.products(id) on delete set null,
  created_at   timestamptz not null default now()
);

alter table public.promo_codes enable row level security;

-- Anon/users can validate codes; only service role writes
create policy "Anyone can read active promo codes"
  on public.promo_codes for select using (true);

-- RPC: increment usage atomically (called from webhook/verify route via service role)
create or replace function public.increment_promo_usage(code_text text)
returns void language plpgsql security definer as $$
begin
  update public.promo_codes
  set used_count = used_count + 1
  where code = code_text;
end;
$$;


-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id                 uuid primary key default uuid_generate_v4(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  product_id         uuid not null references public.products(id),
  cashfree_order_id  text unique not null,
  payment_session_id text,
  amount_inr         integer not null,
  base_amount        integer not null,
  gst_amount         integer not null,
  discount_amount    integer not null default 0,
  promo_code         text,
  promo_discount_pct integer,
  status             text not null default 'PENDING'
                       check (status in ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED')),
  payment_method     text,
  cf_transaction_id  text,
  payment_time       timestamptz,
  webhook_payload    jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Users can read their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Admins can read all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- ============================================================
-- ENROLLMENTS
-- ============================================================
create table if not exists public.enrollments (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  product_id  uuid not null references public.products(id),
  order_id    uuid references public.orders(id),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.enrollments enable row level security;

create policy "Users can read their own enrollments"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy "Admins can read all enrollments"
  on public.enrollments for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- ============================================================
-- CAREER AUDITS
-- ============================================================
create table if not exists public.career_audits (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  enrollment_id       uuid references public.enrollments(id),
  resume_url          text,
  linkedin_url        text,
  submission_status   text not null default 'awaiting_submission'
                        check (submission_status in (
                          'awaiting_submission',
                          'submitted',
                          'under_review',
                          'report_ready'
                        )),
  report_url          text,
  admin_notes         text,
  submitted_at        timestamptz,
  report_uploaded_at  timestamptz,
  created_at          timestamptz not null default now()
);

alter table public.career_audits enable row level security;

create policy "Users can read their own audit"
  on public.career_audits for select
  using (auth.uid() = user_id);

create policy "Users can update their own audit (for submission)"
  on public.career_audits for update
  using (auth.uid() = user_id);

create policy "Admins can manage all audits"
  on public.career_audits for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- ============================================================
-- MENTOR CALL REQUESTS
-- One scheduling request per audit (unique constraint on audit_id)
-- ============================================================
create type if not exists public.mentor_call_status as enum ('pending', 'confirmed', 'completed');

create table if not exists public.mentor_call_requests (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  audit_id        uuid not null references public.career_audits(id) on delete cascade,
  preferred_slots jsonb not null default '[]'::jsonb,
  status          public.mentor_call_status not null default 'pending',
  confirmed_slot  timestamptz,
  meeting_link    text,
  admin_notes     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (audit_id)
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger mentor_call_requests_updated_at
  before update on public.mentor_call_requests
  for each row execute function public.set_updated_at();

alter table public.mentor_call_requests enable row level security;

create policy "Users can read their own call requests"
  on public.mentor_call_requests for select
  using (auth.uid() = user_id);

create policy "Users can insert their own call request"
  on public.mentor_call_requests for insert
  with check (auth.uid() = user_id);

create policy "Admins can manage all call requests"
  on public.mentor_call_requests for all
  using (public.is_admin());


-- ============================================================
-- SPRINT SESSIONS (shared across all Sprint users)
-- ============================================================
create table if not exists public.sprint_sessions (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  session_type  text not null check (session_type in ('group_session', 'mock_interview')),
  scheduled_at  timestamptz not null,
  meeting_link  text,
  recording_url text,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now()
);

alter table public.sprint_sessions enable row level security;

create policy "Published sessions are readable by enrolled users"
  on public.sprint_sessions for select
  using (
    is_published = true
    and exists (
      select 1 from public.enrollments e
      join public.products pr on pr.id = e.product_id
      where e.user_id = auth.uid() and pr.slug = 'interview_sprint'
    )
  );

create policy "Admins can manage all sessions"
  on public.sprint_sessions for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- ============================================================
-- SPRINT SESSION ATTENDANCE
-- ============================================================
create table if not exists public.sprint_session_attendance (
  id            uuid primary key default uuid_generate_v4(),
  session_id    uuid not null references public.sprint_sessions(id) on delete cascade,
  user_id       uuid not null references public.profiles(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id),
  attended      boolean not null default false,
  created_at    timestamptz not null default now(),
  unique (session_id, user_id)
);

alter table public.sprint_session_attendance enable row level security;

create policy "Users can read their own attendance"
  on public.sprint_session_attendance for select
  using (auth.uid() = user_id);

create policy "Admins can manage all attendance"
  on public.sprint_session_attendance for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- ============================================================
-- MENTORSHIP WEEKS
-- ============================================================
create table if not exists public.mentorship_weeks (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  enrollment_id   uuid references public.enrollments(id),
  week_number     integer not null,
  call_scheduled  timestamptz,
  call_notes      text,
  goals           text[],
  created_at      timestamptz not null default now(),
  unique (user_id, week_number)
);

alter table public.mentorship_weeks enable row level security;

create policy "Users can read their own mentorship weeks"
  on public.mentorship_weeks for select
  using (auth.uid() = user_id);

create policy "Admins can manage all mentorship weeks"
  on public.mentorship_weeks for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- ============================================================
-- JOB APPLICATIONS
-- ============================================================
create table if not exists public.job_applications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  company     text not null,
  role        text not null,
  applied_via text,
  status      text not null default 'applied'
                check (status in ('applied', 'oa', 'interview', 'offer', 'rejected')),
  notes       text,
  applied_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.job_applications enable row level security;

create policy "Users can manage their own applications"
  on public.job_applications for all
  using (auth.uid() = user_id);

create policy "Admins can read all applications"
  on public.job_applications for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- ============================================================
-- FAQS
-- ============================================================
create table if not exists public.faqs (
  id          uuid primary key default uuid_generate_v4(),
  question    text not null,
  answer      text not null,
  product_id  uuid references public.products(id) on delete set null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.faqs enable row level security;

create policy "FAQs are publicly readable"
  on public.faqs for select using (true);

create policy "Admins can manage FAQs"
  on public.faqs for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- ============================================================
-- TESTIMONIALS
-- ============================================================
create table if not exists public.testimonials (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  role        text,
  company     text,
  content     text not null,
  rating      integer default 5 check (rating >= 1 and rating <= 5),
  product_id  uuid references public.products(id) on delete set null,
  is_featured boolean not null default false,
  created_at  timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "Testimonials are publicly readable"
  on public.testimonials for select using (true);

create policy "Admins can manage testimonials"
  on public.testimonials for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- ============================================================
-- SITE SETTINGS (key-value store)
-- ============================================================
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- Seed default settings
insert into public.site_settings (key, value) values
  ('homepage_stats', '{"students_placed": "500+", "avg_hike": "45%", "companies_hiring": "80+", "success_rate": "94%"}'::jsonb),
  ('next_batch_date', '"2025-05-01"'::jsonb),
  ('whatsapp_link', '"https://wa.me/919999999999"'::jsonb)
on conflict (key) do nothing;

alter table public.site_settings enable row level security;

create policy "Site settings are publicly readable"
  on public.site_settings for select using (true);

create policy "Admins can manage site settings"
  on public.site_settings for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_admin = true
    )
  );


-- ============================================================
-- PASSWORD RESET OTPS
-- Stores temporary OTPs for the custom forgot-password flow.
-- Accessed only via service role (no RLS needed).
-- ============================================================
create table if not exists public.password_reset_otps (
  email      text primary key,
  otp        text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);


-- ============================================================
-- STORAGE BUCKETS
-- Run these in Supabase Dashboard → Storage, or via API
-- ============================================================

-- Resume bucket: user uploads their own resume
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

-- Audit reports bucket: admin uploads PDF reports
insert into storage.buckets (id, name, public)
values ('audit-reports', 'audit-reports', true)
on conflict (id) do nothing;

-- Storage RLS policies
create policy "Users can upload their own resume"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes'
    and auth.uid()::text = (storage.foldername(name))[2]
  );

create policy "Resumes are publicly readable"
  on storage.objects for select
  using (bucket_id = 'resumes');

create policy "Audit reports are publicly readable"
  on storage.objects for select
  using (bucket_id = 'audit-reports');


-- ============================================================
-- MAKE YOURSELF ADMIN
-- Replace with your actual Supabase Auth user ID
-- ============================================================
-- update public.profiles set is_admin = true where id = 'YOUR-USER-UUID-HERE';


-- ============================================================
-- DONE
-- ============================================================
