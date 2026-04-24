export type ProductSlug =
  | "career_audit"
  | "interview_sprint"
  | "placement_mentorship";

export type BiggestChallenge =
  | "resume_not_shortlisted"
  | "interview_rejections"
  | "no_clarity_on_prep";

export type OrderStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export type AuditStatus =
  | "awaiting_submission"
  | "submitted"
  | "under_review"
  | "report_ready";

export type MentorCallStatus = "pending" | "confirmed" | "completed";

export type ApplicationStatus =
  | "applied"
  | "oa"
  | "interview"
  | "offer"
  | "rejected";

export type MentorshipApplicationStatus =
  | "pending"
  | "invited"
  | "rejected"
  | "enrolled";

export type MentorshipTimeline =
  | "immediate"
  | "1_to_3_months"
  | "3_to_6_months"
  | "exploring";

export type SessionType = "group_session" | "mock_interview";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          phone: string | null;
          is_admin: boolean;
          onboarding_done: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          phone?: string | null;
          is_admin?: boolean;
          onboarding_done?: boolean;
        };
        Update: {
          name?: string;
          phone?: string | null;
          is_admin?: boolean;
          onboarding_done?: boolean;
        };
        Relationships: [];
      };
      onboarding_responses: {
        Row: {
          id: string;
          user_id: string;
          current_role: string | null;
          current_company: string | null;
          target_companies: string[] | null;
          target_role: string | null;
          biggest_challenge: BiggestChallenge | null;
          recommended_product: ProductSlug | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_role?: string | null;
          current_company?: string | null;
          target_companies?: string[] | null;
          target_role?: string | null;
          biggest_challenge?: BiggestChallenge | null;
          recommended_product?: ProductSlug | null;
        };
        Update: {
          current_role?: string | null;
          current_company?: string | null;
          target_companies?: string[] | null;
          target_role?: string | null;
          biggest_challenge?: BiggestChallenge | null;
          recommended_product?: ProductSlug | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          price_inr: number;
          original_price: number | null;
          features: string[] | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          slug: string;
          name: string;
          price_inr: number;
          original_price?: number | null;
          features?: string[] | null;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          price_inr?: number;
          original_price?: number | null;
          features?: string[] | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          cashfree_order_id: string;
          amount_inr: number;
          base_amount: number;
          gst_amount: number;
          discount_amount: number;
          promo_code: string | null;
          promo_discount_pct: number | null;
          status: OrderStatus;
          webhook_payload: Record<string, unknown> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
          cashfree_order_id: string;
          amount_inr: number;
          base_amount: number;
          gst_amount: number;
          discount_amount?: number;
          promo_code?: string | null;
          promo_discount_pct?: number | null;
          status?: OrderStatus;
        };
        Update: {
          status?: OrderStatus;
          webhook_payload?: Record<string, unknown> | null;
        };
        Relationships: [];
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          order_id: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          product_id: string;
          order_id?: string | null;
        };
        Update: {
          order_id?: string | null;
        };
        Relationships: [];
      };
      career_audits: {
        Row: {
          id: string;
          user_id: string;
          enrollment_id: string | null;
          resume_url: string | null;
          linkedin_url: string | null;
          submission_status: AuditStatus;
          submitted_at: string | null;
          report_url: string | null;
          report_uploaded_at: string | null;
          admin_notes: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          enrollment_id?: string | null;
          submission_status?: AuditStatus;
        };
        Update: {
          resume_url?: string | null;
          linkedin_url?: string | null;
          submission_status?: AuditStatus;
          submitted_at?: string | null;
          report_url?: string | null;
          report_uploaded_at?: string | null;
          admin_notes?: string | null;
        };
        Relationships: [];
      };
      mentor_call_requests: {
        Row: {
          id: string;
          user_id: string;
          audit_id: string;
          preferred_slots: string[];
          status: MentorCallStatus;
          confirmed_slot: string | null;
          meeting_link: string | null;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          audit_id: string;
          preferred_slots: string[];
          status?: MentorCallStatus;
        };
        Update: {
          preferred_slots?: string[];
          status?: MentorCallStatus;
          confirmed_slot?: string | null;
          meeting_link?: string | null;
          admin_notes?: string | null;
        };
        Relationships: [];
      };
      sprint_sessions: {
        Row: {
          id: string;
          title: string;
          session_type: SessionType;
          scheduled_at: string;
          meeting_link: string | null;
          recording_url: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          title: string;
          session_type: SessionType;
          scheduled_at: string;
          meeting_link?: string | null;
          recording_url?: string | null;
          is_published?: boolean;
        };
        Update: {
          title?: string;
          session_type?: SessionType;
          scheduled_at?: string;
          meeting_link?: string | null;
          recording_url?: string | null;
          is_published?: boolean;
        };
        Relationships: [];
      };
      sprint_session_attendance: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          enrollment_id: string | null;
          attended: boolean;
          created_at: string;
        };
        Insert: {
          session_id: string;
          user_id: string;
          enrollment_id?: string | null;
          attended?: boolean;
        };
        Update: {
          attended?: boolean;
        };
        Relationships: [];
      };
      mentorship_weeks: {
        Row: {
          id: string;
          user_id: string;
          enrollment_id: string | null;
          week_number: number;
          call_scheduled: string | null;
          call_notes: string | null;
          goals: string[] | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          enrollment_id?: string | null;
          week_number: number;
          call_scheduled?: string | null;
          call_notes?: string | null;
          goals?: string[] | null;
        };
        Update: {
          call_scheduled?: string | null;
          call_notes?: string | null;
          goals?: string[] | null;
        };
        Relationships: [];
      };
      job_applications: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          role: string;
          applied_via: string | null;
          status: ApplicationStatus;
          notes: string | null;
          applied_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          company: string;
          role: string;
          applied_via?: string | null;
          status?: ApplicationStatus;
          notes?: string | null;
          applied_at?: string;
        };
        Update: {
          company?: string;
          role?: string;
          applied_via?: string | null;
          status?: ApplicationStatus;
          notes?: string | null;
        };
        Relationships: [];
      };
      promo_codes: {
        Row: {
          id: string;
          code: string;
          discount_pct: number;
          is_active: boolean;
          max_uses: number | null;
          used_count: number;
          valid_from: string | null;
          valid_until: string | null;
          product_id: string | null;
          created_at: string;
        };
        Insert: {
          code: string;
          discount_pct: number;
          is_active?: boolean;
          max_uses?: number | null;
          used_count?: number;
          valid_from?: string | null;
          valid_until?: string | null;
          product_id?: string | null;
        };
        Update: {
          is_active?: boolean;
          max_uses?: number | null;
          valid_until?: string | null;
          product_id?: string | null;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          product_id: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          question: string;
          answer: string;
          product_id?: string | null;
          sort_order?: number;
        };
        Update: {
          question?: string;
          answer?: string;
          product_id?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string | null;
          company: string | null;
          content: string;
          rating: number | null;
          product_id: string | null;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          role?: string | null;
          company?: string | null;
          content: string;
          rating?: number | null;
          product_id?: string | null;
          is_featured?: boolean;
        };
        Update: {
          name?: string;
          role?: string | null;
          company?: string | null;
          content?: string;
          rating?: number | null;
          product_id?: string | null;
          is_featured?: boolean;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: unknown;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: unknown;
        };
        Update: {
          value?: unknown;
        };
        Relationships: [];
      };
      mentorship_applications: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          current_role: string;
          current_company: string | null;
          years_experience: number;
          target_role: string;
          timeline: MentorshipTimeline;
          goals: string;
          motivation: string;
          linkedin_url: string | null;
          github_url: string | null;
          portfolio_url: string | null;
          resume_url: string | null;
          target_companies: string | null;
          heard_from: string | null;
          status: MentorshipApplicationStatus;
          admin_notes: string | null;
          reviewed_at: string | null;
          invited_at: string | null;
          rejected_at: string | null;
          enrolled_at: string | null;
          submitted_at: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          current_role: string;
          current_company?: string | null;
          years_experience: number;
          target_role: string;
          timeline: MentorshipTimeline;
          goals: string;
          motivation: string;
          linkedin_url?: string | null;
          github_url?: string | null;
          portfolio_url?: string | null;
          resume_url?: string | null;
          target_companies?: string | null;
          heard_from?: string | null;
        };
        Update: {
          status?: MentorshipApplicationStatus;
          admin_notes?: string | null;
          reviewed_at?: string | null;
          invited_at?: string | null;
          rejected_at?: string | null;
          enrolled_at?: string | null;
          resume_url?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_promo_usage: {
        Args: { code_text: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
