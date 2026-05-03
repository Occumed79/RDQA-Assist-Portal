import { Resend } from "resend";
import type { FormField } from "@workspace/db";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;

function getResend(): Resend | null {
  if (!RESEND_API_KEY) return null;
  return new Resend(RESEND_API_KEY);
}

function formatAnswers(fields: FormField[], answers: Record<string, unknown>): string {
  const sorted = [...fields].sort((a, b) => a.order - b.order);
  return sorted
    .map(field => {
      const val = answers[field.id];
      if (val === undefined || val === null || val === "") return null;
      let display = "";
      if (field.type === "checkbox") {
        display = val ? "✓ Yes" : "✗ No";
      } else if (field.type === "rating") {
        display = "★".repeat(Number(val)) + "☆".repeat(5 - Number(val));
      } else if (field.type === "signature") {
        display = "[Signature captured]";
      } else {
        display = String(val);
      }
      return `<tr>
        <td style="padding:10px 16px;border-bottom:1px solid #1e2d42;color:#94a3b8;font-size:13px;white-space:nowrap;vertical-align:top;">${field.label || field.type}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #1e2d42;color:#e2e8f0;font-size:13px;vertical-align:top;">${display}</td>
      </tr>`;
    })
    .filter(Boolean)
    .join("\n");
}

interface NotifyParams {
  formTitle: string;
  formId: number;
  guideTitle: string;
  guideId: number;
  submitterName: string;
  submitterEmail: string;
  submittedAt: Date;
  fields: FormField[];
  answers: Record<string, unknown>;
  appOrigin: string;
}

export async function sendSubmissionNotification(params: NotifyParams): Promise<void> {
  const resend = getResend();
  if (!resend) return; // silently skip — key not configured yet

  const to = NOTIFY_EMAIL || "notifications@guidebuilder.app";
  const {
    formTitle, formId, guideTitle, guideId,
    submitterName, submitterEmail, submittedAt,
    fields, answers, appOrigin,
  } = params;

  const formattedDate = submittedAt.toLocaleString("en-US", {
    dateStyle: "long", timeStyle: "short", timeZone: "UTC",
  });

  const answersHtml = formatAnswers(fields, answers);
  const submissionsUrl = `${appOrigin}/guides/${guideId}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>New Form Submission</title>
</head>
<body style="margin:0;padding:0;background:#080f1c;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080f1c;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;">

        <!-- Header -->
        <tr><td style="padding-bottom:28px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:#1a2a45;border:1px solid rgba(59,130,246,0.25);border-radius:10px;padding:8px 14px;">
                <span style="color:#60a5fa;font-size:14px;font-weight:600;letter-spacing:0.02em;">📋 GuideBuilder</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:linear-gradient(145deg,#0f1e35,#0a1525);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

          <!-- Top accent -->
          <tr><td style="background:linear-gradient(90deg,#2563eb,#3b82f6,#1d4ed8);height:3px;"></td></tr>

          <!-- Title block -->
          <tr><td style="padding:28px 28px 20px;">
            <p style="margin:0 0 8px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;">New Form Submission</p>
            <h1 style="margin:0 0 6px;color:#f1f5f9;font-size:22px;font-weight:700;">${formTitle}</h1>
            <p style="margin:0;color:#475569;font-size:13px;">Guide: <span style="color:#94a3b8;">${guideTitle}</span></p>
          </td></tr>

          <!-- Submitter info -->
          <tr><td style="padding:0 28px 20px;">
            <table width="100%" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;overflow:hidden;" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.06);">
                  <span style="color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">From</span>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 16px;">
                  <p style="margin:0 0 4px;color:#e2e8f0;font-size:15px;font-weight:600;">${submitterName}</p>
                  <p style="margin:0 0 8px;color:#60a5fa;font-size:13px;">${submitterEmail}</p>
                  <p style="margin:0;color:#475569;font-size:12px;">Submitted ${formattedDate} UTC</p>
                </td>
              </tr>
            </table>
          </td></tr>

          ${answersHtml ? `
          <!-- Answers -->
          <tr><td style="padding:0 28px 20px;">
            <p style="margin:0 0 10px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:0.06em;">Responses</p>
            <table width="100%" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;overflow:hidden;" cellpadding="0" cellspacing="0">
              ${answersHtml}
            </table>
          </td></tr>` : ""}

          <!-- CTA -->
          <tr><td style="padding:0 28px 28px;">
            <a href="${submissionsUrl}" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;box-shadow:0 4px 14px rgba(37,99,235,0.4);">
              View All Submissions →
            </a>
          </td></tr>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:20px;text-align:center;">
          <p style="margin:0;color:#1e3a5f;font-size:12px;">Sent by GuideBuilder · You're receiving this because you own form #${formId}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await resend.emails.send({
    from: "GuideBuilder <notifications@resend.dev>",
    to,
    subject: `New response to "${formTitle}" from ${submitterName}`,
    html,
  });
}
