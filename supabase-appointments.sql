-- Appointment requests submitted from the public clinic website.
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  age integer NOT NULL CHECK (age >= 0 AND age <= 130),
  address text NOT NULL,
  phone_number text NOT NULL,
  doctor_name text NOT NULL,
  appointment_date date NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reject', 'Completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments
DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE public.appointments
ADD CONSTRAINT appointments_status_check
CHECK (status IN ('Pending', 'Reject', 'Completed'));

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Appointment data contains patient information. The public website only needs
-- to submit requests; reads and mutations must stay server-side.
REVOKE SELECT, UPDATE, DELETE ON public.appointments FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Anyone can submit appointment requests" ON public.appointments;
CREATE POLICY "Anyone can submit appointment requests"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Optional: allow staff dashboards to read appointment requests.
-- CREATE POLICY "Authenticated users can view appointments"
-- ON public.appointments FOR SELECT TO authenticated USING (true);
