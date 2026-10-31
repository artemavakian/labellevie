import { useState } from 'react'
import './ContactForm.css'

// Web3Forms delivers every submission to the inbox set up for the LBV form.
// The access key is meant to sit in the page — it only allows sending.
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_ACCESS_KEY = '41afc782-6061-4a5b-b161-e29a35742d60'

const MSG_PLACEHOLDER =
  'Tell us what services you are interested in, or any questions or concerns you have, and the best time to contact you for a free consultation.'

/* The site's inquiry form. `formName` names the page it sits on; it travels
   with each submission as a hidden field and in the email's subject line,
   so the two forms can be told apart in the inbox. */
export default function ContactForm({
  formName,
  messagePlaceholder = MSG_PLACEHOLDER,
  extraClass = '',
  cardMode = false,
  charLimit = null,
  submitLabel = 'Send Message',
}) {
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })
  // null, or what to tell the visitor: the form isn't complete, or it
  // couldn't be sent.
  const [error, setError] = useState(null)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const set = k => e => {
    const val = charLimit && k === 'message'
      ? e.target.value.slice(0, charLimit)
      : e.target.value
    setF(prev => ({ ...prev, [k]: val }))
  }

  const submit = async e => {
    e.preventDefault()
    if (sending) return
    if (Object.values(f).some(v => v.trim() === '')) {
      setError('Please fill in all fields before submitting.')
      return
    }
    setError(null)
    setSending(true)

    // Everything named in the form, the hidden form name included, plus the
    // key and how the email should be headed.
    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New inquiry — ${formName}`,
          from_name: 'La Belle Vie website',
          name: `${f.firstName} ${f.lastName}`.trim(),
        }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed')
      setSent(true)
    } catch {
      setError('Sorry — your message couldn’t be sent. Please try again, or call or email us directly.')
    } finally {
      setSending(false)
    }
  }

  const formClass = ['cf-form', cardMode ? 'cf-form--card' : '', extraClass].filter(Boolean).join(' ')
  const successClass = ['cf-success', extraClass].filter(Boolean).join(' ')

  if (sent) {
    return (
      <div className={successClass} role="status" aria-live="polite">
        <p className="cf-success__thanks">
          Thank you, {f.firstName}
        </p>
        <p className="cf-success__detail">
          We&apos;ve received your message and will be in touch.
        </p>
      </div>
    )
  }

  return (
    <form className={formClass} onSubmit={submit} noValidate aria-busy={sending}>
      {error && (
        <p className="cf-error" role="alert">{error}</p>
      )}

      <input type="hidden" name="inquiry_form" value={formName} />
      {/* Honeypot: hidden from people, filled in only by bots, which
          Web3Forms then discards. */}
      <input type="checkbox" name="botcheck" className="cf-botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="cf-row">
        <div className="cf-field">
          <input className="cf-input" type="text" name="first_name" placeholder="First Name" aria-label="First name"
            autoComplete="given-name"
            value={f.firstName} onChange={set('firstName')} />
        </div>
        <div className="cf-field">
          <input className="cf-input" type="text" name="last_name" placeholder="Last Name" aria-label="Last name"
            autoComplete="family-name"
            value={f.lastName} onChange={set('lastName')} />
        </div>
      </div>

      <div className="cf-row">
        <div className="cf-field">
          <input className="cf-input" type="email" name="email" placeholder="Email Address" aria-label="Email address"
            autoComplete="email"
            value={f.email} onChange={set('email')} />
        </div>
        <div className="cf-field">
          <input className="cf-input" type="tel" name="phone" placeholder="Phone Number" aria-label="Phone number"
            autoComplete="tel"
            value={f.phone} onChange={set('phone')} />
        </div>
      </div>

      <div className="cf-textarea-wrap">
        <textarea
          className="cf-textarea"
          name="message"
          rows={4}
          placeholder={messagePlaceholder}
          aria-label="Message"
          value={f.message}
          onChange={set('message')}
          maxLength={charLimit ?? undefined}
        />
        {charLimit && (
          <span className={`cf-char-count${f.message.length >= charLimit ? ' cf-char-count--full' : ''}`}>
            {f.message.length}/{charLimit}
          </span>
        )}
      </div>

      <div className="cf-submit-wrap">
        <button type="submit" className={`cf-submit${cardMode ? ' cf-submit--card' : ''}`} disabled={sending}>
          {sending ? 'Sending…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
