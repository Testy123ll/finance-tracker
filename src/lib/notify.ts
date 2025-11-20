export async function sendEmail(to: string, subject: string, text: string) {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    console.log('[EMAIL]', { to, subject, text })
    return { ok: true, stub: true }
  }
  try {
    const nodemailer = await import('nodemailer')
    const transporter = nodemailer.createTransport({ host, port, auth: { user, pass } })
    await transporter.sendMail({ from: user, to, subject, text })
  } catch (err) {
    console.warn('[EMAIL] nodemailer not installed or failed, falling back to stub', err)
    console.log('[EMAIL]', { to, subject, text })
    return { ok: true, stub: true }
  }
  return { ok: true }
}

export async function sendSMS(to: string, text: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM
  if (!sid || !token || !from) {
    console.log('[SMS]', { to, text })
    return { ok: true, stub: true }
  }
  try {
    const twilioModule = await import('twilio')
    const client = twilioModule.default(sid, token)
    await client.messages.create({ from, to, body: text })
  } catch (err) {
    console.warn('[SMS] twilio not installed or failed, falling back to stub', err)
    console.log('[SMS]', { to, text })
    return { ok: true, stub: true }
  }
  return { ok: true }
}