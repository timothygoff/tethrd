import { Resend } from "resend";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

export async function sendEmail(to: string, subject: string, html: string) {
  await getResend().emails.send({
    from: "tethrd <tim@tethrd.io>",
    to,
    subject,
    html,
  });
}
