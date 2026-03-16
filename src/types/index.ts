export type Role = "ADMIN" | "MANAGER" | "STAFF";

export type ScheduleState = "DRAFT" | "PUBLISHED";

export type SwapStatus =
  | "PENDING_ACCEPTANCE"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type DropStatus =
  | "OPEN"
  | "CLAIMED_PENDING_APPROVAL"
  | "APPROVED"
  | "EXPIRED"
  | "CANCELLED";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Location {
  id: string;
  name: string;
  address?: string | null;
  timezone: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Shift {
  id: string;
  locationId: string;
  skillId: string;
  startAt: string;
  endAt: string;
  headcountRequired: number;
  scheduleState: ScheduleState;
  publishedAt?: string | null;
  location?: Location;
  skill?: Skill;
  assignments?: ShiftAssignment[];
}

export interface ShiftAssignment {
  id: string;
  shiftId: string;
  userId: string;
  assignedAt: string;
  assignedBy?: string | null;
  shift?: Shift;
  user?: User;
}

export interface SwapRequest {
  id: string;
  shiftId: string;
  requesterId: string;
  receiverId: string;
  status: SwapStatus;
  managerApprovedBy?: string | null;
  managerRejectedBy?: string | null;
  shift?: Shift;
  requester?: User;
  receiver?: User;
  managerApprovedByUser?: User | null;
  managerRejectedByUser?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface DropRequest {
  id: string;
  shiftId: string;
  userId: string;
  status: DropStatus;
  expiresAt: string;
  shift?: Shift;
  user?: User;
  pickup?: { userId: string; user?: User };
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body?: string | null;
  readAt?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface FairnessScore {
  userId: string;
  totalHours: number;
  premiumHours: number;
  desiredMin?: number;
  desiredMax?: number;
  score: number;
}

export interface OvertimeWarning {
  userId: string;
  type: "weekly" | "daily" | "consecutive_days";
  message: string;
  hours?: number;
  requiresOverride?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: Pick<User, "id" | "email" | "firstName" | "lastName" | "role">;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ConstraintViolation {
  rule: string;
  message: string;
  alternatives?: Array<{ userId: string; name: string }>;
}

export interface AssignmentResult {
  success: boolean;
  assignment?: { id: string; shiftId: string; userId: string };
  violation?: ConstraintViolation;
}

export interface ShiftFilters {
  locationId?: string;
  startDate?: string;
  endDate?: string;
  state?: ScheduleState;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}
