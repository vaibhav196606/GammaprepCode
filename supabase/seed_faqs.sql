-- Seed homepage FAQs into the faqs table.
-- Run this in Supabase Dashboard → SQL Editor.
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING via a CTE guard.

DO $$
BEGIN
  -- Only seed if the table is empty to avoid duplicates on re-runs
  IF (SELECT COUNT(*) FROM public.faqs) = 0 THEN

    -- General FAQs (no product association)
    INSERT INTO public.faqs (question, answer, product_id, sort_order) VALUES
    (
      'What''s the difference between the three products?',
      'Career Audit ({career_audit_price}) is a one-time expert review of your resume and LinkedIn - you get a gap analysis and action plan. Interview Sprint ({interview_sprint_price}) is a 21-day structured program with live sessions and a mock interview. Placement Mentorship ({placement_mentorship_price}) is ongoing 1:1 support with weekly calls until you get placed.',
      NULL,
      1
    ),
    (
      'Are the sessions live or recorded?',
      'Interview Sprint sessions are live (with recordings shared afterward). Placement Mentorship calls are 1:1 live sessions scheduled weekly.',
      NULL,
      2
    ),
    (
      'Can I buy Interview Sprint without the Career Audit?',
      'Yes, each product is standalone. But we recommend starting with the Career Audit - it costs {career_audit_price} and gives you a clear picture of your gaps, which makes the Sprint much more effective.',
      NULL,
      3
    ),
    (
      'Is there a refund policy?',
      'Career Audit is non-refundable after the report is delivered. For Interview Sprint and Mentorship, we offer a refund within 24 hours of purchase if no sessions have been conducted. See our full refund policy.',
      NULL,
      4
    );

    -- Career Audit FAQ
    INSERT INTO public.faqs (question, answer, product_id, sort_order) VALUES
    (
      'How soon do I get my Career Audit results?',
      'Within 24–48 hours of submitting your resume and LinkedIn URL. You''ll receive a detailed PDF report via your dashboard.',
      (SELECT id FROM public.products WHERE slug = 'career_audit'),
      1
    );

  END IF;
END;
$$;
