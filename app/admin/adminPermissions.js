export const ADMIN_ROLES = {
  ADMIN: "admin",
  COORDINATOR: "coordinator",
  ESSAY_LEAD: "essay_lead",
  VOLUNTEER_LEAD: "volunteer_lead",
  VIEWER: "viewer",
};

export const ROLE_LABELS = {
  admin: "Admin",
  coordinator: "Coordinator",
  essay_lead: "Essay Lead",
  volunteer_lead: "Volunteer Lead",
  viewer: "Viewer",
};

const ADMIN_PAGE_PERMISSIONS = {
  "/admin": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.COORDINATOR,
    ADMIN_ROLES.ESSAY_LEAD,
    ADMIN_ROLES.VOLUNTEER_LEAD,
    ADMIN_ROLES.VIEWER,
  ],

  "/admin/staff": [ADMIN_ROLES.ADMIN],

  "/admin/status-guide": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.COORDINATOR,
    ADMIN_ROLES.ESSAY_LEAD,
    ADMIN_ROLES.VOLUNTEER_LEAD,
    ADMIN_ROLES.VIEWER,
  ],

  "/admin/volunteer-onboarding": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.COORDINATOR,
    ADMIN_ROLES.VOLUNTEER_LEAD,
    ADMIN_ROLES.VIEWER,
  ],

  "/admin/launch": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.COORDINATOR,
    ADMIN_ROLES.VIEWER,
  ],

  "/admin/students": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.COORDINATOR,
    ADMIN_ROLES.VIEWER,
  ],

  "/admin/volunteers": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.VOLUNTEER_LEAD,
    ADMIN_ROLES.VIEWER,
  ],

  "/admin/essays": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.ESSAY_LEAD,
    ADMIN_ROLES.COORDINATOR,
    ADMIN_ROLES.VIEWER,
  ],

  "/admin/matches": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.COORDINATOR,
    ADMIN_ROLES.VIEWER,
  ],

  "/admin/sessions": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.COORDINATOR,
    ADMIN_ROLES.VIEWER,
  ],

  "/admin/outcomes": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.COORDINATOR,
    ADMIN_ROLES.VIEWER,
  ],

  "/admin/messages": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.COORDINATOR,
    ADMIN_ROLES.VIEWER,
  ],

  "/admin/feedback": [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.COORDINATOR,
    ADMIN_ROLES.VIEWER,
  ],
};

const ADMIN_ACTION_PERMISSIONS = {
  updateStudentStatus: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],
  updateStudentPriority: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],
  updateStudentNotes: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],

  updateVolunteerStatus: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.VOLUNTEER_LEAD],
  updateVolunteerNotes: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.VOLUNTEER_LEAD],

  assignEssayReviewer: [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.ESSAY_LEAD,
    ADMIN_ROLES.COORDINATOR,
  ],

  updateEssayStatus: [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.ESSAY_LEAD,
    ADMIN_ROLES.COORDINATOR,
  ],

  updateEssayNotes: [
    ADMIN_ROLES.ADMIN,
    ADMIN_ROLES.ESSAY_LEAD,
    ADMIN_ROLES.COORDINATOR,
  ],

  createMatch: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],
  logSession: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],
  saveApplicationOutcome: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],
};

const ADMIN_EXPORT_PERMISSIONS = {
  students: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],
  volunteers: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.VOLUNTEER_LEAD],
  essays: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.ESSAY_LEAD, ADMIN_ROLES.COORDINATOR],
  matches: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],
  sessions: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],
  applications: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],
  messages: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],
  feedback: [ADMIN_ROLES.ADMIN, ADMIN_ROLES.COORDINATOR],
};

export function normalizeRole(role) {
  return String(role || "").trim().toLowerCase();
}

export function getRoleLabel(role) {
  const normalizedRole = normalizeRole(role);
  return ROLE_LABELS[normalizedRole] || "No Role";
}

export function isAnyAdminRole(role) {
  const normalizedRole = normalizeRole(role);

  return Object.values(ADMIN_ROLES).includes(normalizedRole);
}

export function isFullAdmin(role) {
  return normalizeRole(role) === ADMIN_ROLES.ADMIN;
}

export function canAccessAdminPage(role, path) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === ADMIN_ROLES.ADMIN) {
    return true;
  }

  const allowedRoles = ADMIN_PAGE_PERMISSIONS[path] || [];

  return allowedRoles.includes(normalizedRole);
}

export function canPerformAdminAction(role, action) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === ADMIN_ROLES.ADMIN) {
    return true;
  }

  const allowedRoles = ADMIN_ACTION_PERMISSIONS[action] || [];

  return allowedRoles.includes(normalizedRole);
}

export function canExportAdminData(role, type) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === ADMIN_ROLES.ADMIN) {
    return true;
  }

  const allowedRoles = ADMIN_EXPORT_PERMISSIONS[type] || [];

  return allowedRoles.includes(normalizedRole);
}

export function isReadOnlyAdmin(role) {
  return normalizeRole(role) === ADMIN_ROLES.VIEWER;
}

export function getAllowedAdminPages(role) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === ADMIN_ROLES.ADMIN) {
    return Object.keys(ADMIN_PAGE_PERMISSIONS);
  }

  return Object.entries(ADMIN_PAGE_PERMISSIONS)
    .filter(([, allowedRoles]) => allowedRoles.includes(normalizedRole))
    .map(([path]) => path);
}