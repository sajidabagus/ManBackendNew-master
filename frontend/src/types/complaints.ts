export type ReporterType = "siswa" | "orang_tua" | "guru_tendik" | "masyarakat";
export type IdentityMode = "identified" | "anonymous";
export type ComplaintStatus =
  | "submitted"
  | "under_review"
  | "assigned"
  | "in_progress"
  | "waiting_reporter"
  | "resolved"
  | "closed"
  | "rejected";
export type ComplaintPriority = "low" | "normal" | "high" | "urgent";

export interface ComplaintCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active?: boolean;
  is_sensitive?: boolean;
  default_priority?: ComplaintPriority;
  sort_order?: number;
}

export interface ComplaintReceipt {
  ticket_number: string;
  access_code: string;
  created_at?: string;
  title?: string;
}

export interface PublicComplaint {
  ticket_number: string;
  title: string;
  status: ComplaintStatus;
  status_label?: string;
  created_at?: string;
  updated_at?: string;
  category?: { id: number; name: string; slug: string };
  timeline?: {
    status?: string;
    status_label?: string;
    note?: string | null;
    created_at?: string;
  }[];
  messages?: {
    sender_type?: string;
    message: string;
    created_at?: string;
  }[];
  attachments?: {
    id: number;
    original_name: string;
    mime_type: string;
    file_size: number;
  }[];
  needs_reporter_info?: boolean;
}

export interface TrackComplaintResponse {
  tracking_token: string;
  expires_at: string;
  complaint: PublicComplaint;
}

export interface AdminComplaintListItem {
  id: number;
  ticket_number: string;
  title: string;
  reporter_type: ReporterType;
  identity_mode: IdentityMode;
  status: ComplaintStatus;
  status_label?: string;
  priority: ComplaintPriority;
  created_at?: string;
  category?: { id: number; name: string; slug: string; is_sensitive?: boolean };
  assignee?: { id: number; name: string; email: string } | null;
}

export interface AdminComplaintDetail extends AdminComplaintListItem {
  description?: string;
  location?: string | null;
  incident_at?: string | null;
  resolved_at?: string | null;
  allowed_transitions?: ComplaintStatus[];
  identity?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    contact_preference?: string | null;
  } | null;
  identity_restricted?: boolean;
  attachments?: {
    id: number;
    original_name: string;
    mime_type: string;
    file_size: number;
    visibility?: string;
    created_at?: string;
  }[];
  messages?: {
    id: number;
    sender_type?: string;
    sender_name?: string | null;
    message: string;
    visibility?: string;
    created_at?: string;
  }[];
  status_histories?: {
    old_status?: string | null;
    new_status?: string;
    note?: string | null;
    visibility?: string;
    changed_by?: string | null;
    created_at?: string;
  }[];
  audit_logs?: {
    action: string;
    actor?: string | null;
    metadata?: Record<string, unknown> | null;
    created_at?: string;
  }[];
}

export interface ComplaintDashboardStats {
  total: number;
  new: number;
  in_progress: number;
  resolved: number;
  high_priority: number;
  by_status: Record<string, number>;
  by_category: { name: string; total: number }[];
  trend: { date: string; total: number }[];
}
