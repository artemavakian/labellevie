import { useState } from 'react'
import './ContactForm.css'

const MSG_PLACEHOLDER =
  'Tell us what services you are interested in, or any questions or concerns you have, and the best time to contact you for a free consultation.'

export default function ContactForm({
  messagePlaceholder = MSG_PLACEHOLDER,
  extraClass = '',
  cardMode = false,
  charLimit = null,
  submitLabel = 'Send Message',
}) {
  const [f, setF] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' })
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)

  const set = k => e => {
    const val = charLimit && k === 'message'
      ? e.target.value.slice(0, charLimit)
      : e.target.value
    setF(prev => ({ ...prev, [k]: val }))
  }

  const submit = e => {
    e.preventDefault()
    if (Object.values(f).some(v => v.trim() === '')) {
      setError(true)
      return
    }
    setError(false)
    setSent(true)
  }

  const formClass = ['cf-form', cardMode ? 'cf-form--card' : '', extraClass].filter(Boolean).join(' ')
  const successClass = ['cf-success', extraClass].filter(Boolean).join(' ')

  if (sent) {
    return (
      <div className={successClass} role="status" aria-live="polite">
        <p className="cf-success__thanks">Thank you, {f.firstName}!</p>
        <p className="cf-success__detail">
          We&apos;ve received your message and will be in touch.
        </p>
      </div>
    )
  }

  return (
    <form className={formClass} onSubmit={submit} noValidate>
      {error && (
        <p className="cf-error" role="alert">Please fill in all fields before submitting.</p>
      )}

      <div className="cf-row">
        <div className="cf-field">
          <input className="cf-input" type="text" placeholder="First Name" aria-label="First name"
            autoComplete="given-name"
            value={f.firstName} onChange={set('firstName')} />
        </div>
        <div className="cf-field">
          <input className="cf-input" type="text" placeholder="Last Name" aria-label="Last name"
            autoComplete="family-name"
            value={f.lastName} onChange={set('lastName')} />
        </div>
      </div>

      <div className="cf-row">
        <div className="cf-field">
          <input className="cf-input" type="email" placeholder="Email Address" aria-label="Email address"
            autoComplete="email"
            value={f.email} onChange={set('email')} />
        </div>
        <div className="cf-field">
          <input className="cf-input" type="tel" placeholder="Phone Number" aria-label="Phone number"
            autoComplete="tel"
            value={f.phone} onChange={set('phone')} />
        </div>
      </div>

      <div className="cf-textarea-wrap">
        <textarea
          className="cf-textarea"
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
        <button type="submit" className={`cf-submit${cardMode ? ' cf-submit--card' : ''}`}>
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
