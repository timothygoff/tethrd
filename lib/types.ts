export type Scenario = "commitment_hold" | "full_escrow" | "service_payment";
export type TethrdStatus = "pending" | "active" | "capturing" | "confirmed" | "expired" | "cancelled";

export interface Tethrd {
  id: string;
  creator_id: string;
  scenario: Scenario;
  amount: number;
  currency: string;
  timer_hours: 3 | 6 | 12 | 24;
  deadline: string | null;
  description: string;
  status: TethrdStatus;
  creator_confirmed: boolean;
  joiner_id: string | null;
  joiner_confirmed: boolean;
  expires_at: string | null;
  payment_intent_id: string | null;
  warning_sent: boolean;
  created_at: string;
}

export const SCENARIO_LABELS: Record<Scenario, string> = {
  commitment_hold: "Commitment Hold",
  full_escrow: "Full Two-Way Escrow",
  service_payment: "Service Payment",
};

export const SCENARIO_DESCRIPTIONS: Record<Scenario, string> = {
  commitment_hold: "One party deposits to secure a meeting. Both confirm after — deposit releases. No-show? Auto-refund.",
  full_escrow: "Both parties deposit simultaneously. Both confirm — funds cross. Timer expires — everything returns.",
  service_payment: "Client pays upfront into escrow. Provider delivers, both confirm, payment releases.",
};
