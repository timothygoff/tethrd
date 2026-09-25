export type Scenario = "commitment_hold" | "two_way_hold" | "service_payment";
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
  two_way_hold: "Two-Way Hold",
  service_payment: "Service Payment",
};

export const SCENARIO_DESCRIPTIONS: Record<Scenario, string> = {
  commitment_hold: "One party deposits to secure a meeting. Both confirm after — deposit releases. No-show? Auto-refund.",
  two_way_hold: "Both parties pay in at the same time and we hold both payments. Both confirm — the payments are released. Timer expires — everyone is refunded.",
  service_payment: "Client pays upfront and we hold the payment. Provider delivers, both confirm, payment releases.",
};
