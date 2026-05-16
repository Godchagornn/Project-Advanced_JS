export interface ValidationResult {
  valid: boolean
  message: string
}

const ok = (): ValidationResult => ({ valid: true, message: '' })
const fail = (message: string): ValidationResult => ({ valid: false, message })

export function validateRequired(value: string, fieldName: string): ValidationResult {
  return value.trim().length > 0 ? ok() : fail(`${fieldName} is required.`)
}

export function validateMinLength(
  value: string,
  min: number,
  fieldName: string
): ValidationResult {
  return value.trim().length >= min
    ? ok()
    : fail(`${fieldName} must be at least ${min} characters.`)
}

export function validateMaxLength(
  value: string,
  max: number,
  fieldName: string
): ValidationResult {
  return value.trim().length <= max ? ok() : fail(`${fieldName} must be at most ${max} characters.`)
}

export function validateEmail(value: string): ValidationResult {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(value.trim()) ? ok() : fail('Please enter a valid email address.')
}

export function validatePhone(value: string): ValidationResult {
  const re = /^[0-9+\-\s()]{7,15}$/
  return re.test(value.trim()) ? ok() : fail('Please enter a valid phone number.')
}

export function validatePostalCode(value: string): ValidationResult {
  const re = /^\d{5}$/
  return re.test(value.trim()) ? ok() : fail('Postal code must be exactly 5 digits.')
}

export function validateCardLast4(value: string): ValidationResult {
  const re = /^\d{4}$/
  return re.test(value.trim()) ? ok() : fail('Last 4 digits must be exactly 4 numbers.')
}

export function validateRating(value: number): ValidationResult {
  return value >= 1 && value <= 5 ? ok() : fail('Please select a rating between 1 and 5.')
}

// Checkout form

export interface CheckoutFields {
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  paymentMethod: string
  cardLast4: string
  deliveryNotes: string
}

export type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>

export function validateCheckout(fields: CheckoutFields): CheckoutErrors {
  const errors: CheckoutErrors = {}

  const name = validateMinLength(fields.customerName, 2, 'Full name')
  if (!name.valid) errors.customerName = name.message

  const email = validateEmail(fields.email)
  if (!email.valid) errors.email = email.message

  const phone = validatePhone(fields.phone)
  if (!phone.valid) errors.phone = phone.message

  const address = validateMinLength(fields.address, 10, 'Address')
  if (!address.valid) errors.address = address.message

  const city = validateRequired(fields.city, 'City')
  if (!city.valid) errors.city = city.message

  const postal = validatePostalCode(fields.postalCode)
  if (!postal.valid) errors.postalCode = postal.message

  const payment = validateRequired(fields.paymentMethod, 'Payment method')
  if (!payment.valid) errors.paymentMethod = payment.message

  if (fields.paymentMethod === 'card') {
    const card = validateCardLast4(fields.cardLast4)
    if (!card.valid) errors.cardLast4 = card.message
  }

  return errors
}

// Review form

export interface ReviewFields {
  author: string
  rating: number
  title: string
  body: string
}

export type ReviewErrors = Partial<Record<keyof ReviewFields, string>>

export function validateReview(fields: ReviewFields): ReviewErrors {
  const errors: ReviewErrors = {}

  const author = validateMinLength(fields.author, 2, 'Name')
  if (!author.valid) errors.author = author.message

  const rating = validateRating(fields.rating)
  if (!rating.valid) errors.rating = rating.message

  const title = validateMinLength(fields.title, 3, 'Title')
  if (!title.valid) errors.title = title.message

  const body = validateMinLength(fields.body, 10, 'Review')
  if (!body.valid) errors.body = body.message

  const bodyMax = validateMaxLength(fields.body, 500, 'Review')
  if (!bodyMax.valid) errors.body = bodyMax.message

  return errors
}
