// TypeScript interfaces for type safety

export interface AuthResponse {
  success: boolean;
  message: string;
  tgt?: string;
  username?: string;
  expiresIn?: string;
  error?: string;
}

export interface ServiceTicketResponse {
  success: boolean;
  message: string;
  serviceTicket?: string;
  username?: string;
  service?: string;
  expiresIn?: string;
  error?: string;
}

export interface ServiceAccessResponse {
  success: boolean;
  message: string;
  data?: {
    username: string;
    service: string;
    resourceId: string;
    databaseName: string;
    accessLevel: string;
    apiKey: string;
    timestamp: string;
    sessionDuration: string;
  };
  error?: string;
}

export interface LogEntry {
  id: string;
  actor: 'Client' | 'AS' | 'TGS' | 'Service' | 'System';
  action: string;
  status: 'info' | 'success' | 'error' | 'warning';
  timestamp: string;
}

export interface AppState {
  // Authentication Step
  username: string;
  password: string;
  tgt: string | null;
  tgtExpiry: string | null;

  // Service Ticket Step
  serviceTicket: string | null;
  serviceTicketExpiry: string | null;

  // Service Access Step
  protectedData: ServiceAccessResponse['data'] | null;

  // UI State
  currentStep: number;
  loading: boolean;
  error: string | null;
  logs: LogEntry[];
}
