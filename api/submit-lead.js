export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;

  // Honeypot check — if the hidden field is filled out, silently succeed
  if (data._hp_name && data._hp_name.trim() !== '') {
    return res.status(200).json({ success: true, note: 'honeypot triggered' });
  }

  const { name, company, email, phone, interest, budget, message } = data;

  // Basic server-side validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // 1. Write to Supabase (via REST API)
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    try {
      const supaRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name,
          company,
          email,
          phone,
          interest,
          budget,
          message,
          source: 'Website Contact Form'
        })
      });

      if (!supaRes.ok) {
        console.error('Supabase Error:', await supaRes.text());
        // Continue to send email even if DB insert fails
      }
    } catch (err) {
      console.error('Supabase Exception:', err);
    }
  }

  // 2. Send notification email via Resend
  if (process.env.RESEND_API_KEY) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'Website Form <onboarding@resend.dev>', // Adjust if domain verified
          to: process.env.NOTIFY_EMAIL || 'info@imperiondatasystem.com',
          subject: `New Lead Inquiry from ${name} (${company || 'No Company'})`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <p><strong>Interest:</strong> ${interest || 'N/A'}</p>
            <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
            <br/>
            <h3>Message:</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        })
      });

      if (!resendRes.ok) {
        console.error('Resend Error:', await resendRes.text());
        return res.status(500).json({ error: 'Failed to send notification email.' });
      }
    } catch (err) {
      console.error('Resend Exception:', err);
      return res.status(500).json({ error: 'Failed to trigger email service.' });
    }
  } else {
    console.warn("No RESEND_API_KEY configured; skipping email dispatch.");
  }

  return res.status(200).json({ success: true });
}
