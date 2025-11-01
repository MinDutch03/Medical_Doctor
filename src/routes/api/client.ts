// Client-safe exports only (no server-only imports)

export function medicalAgentPath(sessionId: string) { return `/dashboard/medical-agent/${sessionId}`; }
export function dashboardPath() { return `/dashboard`; }
export function signInPath() { return `/sign-in`; }


