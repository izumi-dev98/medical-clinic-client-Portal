-- Add social media URLs to the clinic information table.
ALTER TABLE public.clinic_information
ADD COLUMN IF NOT EXISTS social_urls jsonb DEFAULT '{}'::jsonb;

-- Replace the placeholder URLs, then run this update.
UPDATE public.clinic_information
SET social_urls = jsonb_build_object(
  'facebook', 'https://facebook.com/your-page',
  'tiktok', 'https://tiktok.com/@your-account',
  'youtube', 'https://youtube.com/@your-channel',
  'instagram', 'https://instagram.com/your-account',
  'x', 'https://x.com/your-account',
  'telegram', 'https://t.me/your-account',
  'linkedin', 'https://linkedin.com/company/your-company'
)
WHERE id = (SELECT id FROM public.clinic_information ORDER BY id LIMIT 1);

-- Check the saved data.
SELECT clinic_title, social_urls
FROM public.clinic_information;
