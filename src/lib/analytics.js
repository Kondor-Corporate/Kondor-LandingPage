const ATTRIBUTION_STORAGE_KEY = 'kondor_attribution_v1'
const ENTRY_STORAGE_KEY = 'kondor_entry_context_v1'
const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
const CONTENT_PIECE_KEYS = ['content_piece_id', 'content_piece', 'cpid']

function hasWindow() {
  return typeof window !== 'undefined'
}

function getGtmScriptUrl(gtmId) {
  const scriptUrl = new URL('https://www.googletagmanager.com/gtm.js')
  scriptUrl.searchParams.set('id', gtmId)

  const pageParams = new URLSearchParams(window.location.search)
  const preview = pageParams.get('gtm_preview')
  const auth = pageParams.get('gtm_auth')

  if (preview && auth) {
    scriptUrl.searchParams.set('gtm_preview', preview)
    scriptUrl.searchParams.set('gtm_auth', auth)
    scriptUrl.searchParams.set('gtm_cookies_win', pageParams.get('gtm_cookies_win') || 'x')
  }

  return scriptUrl.toString()
}

function nowIso() {
  return new Date().toISOString()
}

function readJson(storage, key) {
  try {
    const raw = storage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeJson(storage, key, value) {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable in privacy modes; analytics must not block UX.
  }
}

function cleanValue(value) {
  const normalized = value?.trim()
  return normalized || null
}

function getExternalReferrer() {
  if (!hasWindow() || !document.referrer) return null

  try {
    const referrerUrl = new URL(document.referrer)
    if (referrerUrl.hostname === window.location.hostname) return null
    return referrerUrl.hostname
  } catch {
    return null
  }
}

function buildUrlAttribution(searchParams) {
  const values = {}

  UTM_KEYS.forEach((key) => {
    values[key] = cleanValue(searchParams.get(key))
  })

  const contentPieceId = CONTENT_PIECE_KEYS.map((key) => cleanValue(searchParams.get(key))).find(Boolean)
  values.content_piece_id = contentPieceId || values.utm_content || null

  const hasExplicitCampaign = Object.values(values).some(Boolean)
  if (!hasExplicitCampaign) return null

  return {
    source: values.utm_source || 'unknown',
    medium: values.utm_medium || 'unknown',
    campaign: values.utm_campaign || null,
    utm_content: values.utm_content || null,
    utm_term: values.utm_term || null,
    content_piece_id: values.content_piece_id || null,
    captured_at: nowIso(),
  }
}

function buildFallbackAttribution() {
  const referrerHost = getExternalReferrer()

  if (referrerHost) {
    return {
      source: referrerHost,
      medium: 'referral',
      campaign: null,
      utm_content: null,
      utm_term: null,
      content_piece_id: null,
      captured_at: nowIso(),
    }
  }

  return {
    source: 'direct',
    medium: 'none',
    campaign: null,
    utm_content: null,
    utm_term: null,
    content_piece_id: null,
    captured_at: nowIso(),
  }
}

function readStoredAttribution() {
  if (!hasWindow()) return null

  const stored = readJson(window.localStorage, ATTRIBUTION_STORAGE_KEY)
  if (!stored?.captured_at) return null

  const capturedAt = Date.parse(stored.captured_at)
  if (Number.isNaN(capturedAt) || Date.now() - capturedAt > ATTRIBUTION_TTL_MS) return null

  return stored
}

export function initializeAttribution() {
  if (!hasWindow()) return null

  const searchParams = new URLSearchParams(window.location.search)
  const explicitAttribution = buildUrlAttribution(searchParams)
  const storedAttribution = readStoredAttribution()
  const attribution = explicitAttribution || storedAttribution || buildFallbackAttribution()

  writeJson(window.localStorage, ATTRIBUTION_STORAGE_KEY, attribution)

  const existingEntry = readJson(window.sessionStorage, ENTRY_STORAGE_KEY)
  if (!existingEntry) {
    writeJson(window.sessionStorage, ENTRY_STORAGE_KEY, {
      landing_path: window.location.pathname,
      entry_point: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      referrer: document.referrer || null,
      captured_at: nowIso(),
    })
  }

  return attribution
}

export function getAttributionContext() {
  if (!hasWindow()) return {}

  return {
    attribution: readStoredAttribution() || buildFallbackAttribution(),
    entry: readJson(window.sessionStorage, ENTRY_STORAGE_KEY) || {
      landing_path: window.location.pathname,
      entry_point: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      referrer: document.referrer || null,
      captured_at: nowIso(),
    },
  }
}

export function initAnalytics() {
  if (!hasWindow() || window.__kondorAnalyticsInitialized) return

  window.__kondorAnalyticsInitialized = true
  window.dataLayer = window.dataLayer || []

  const gtmId = import.meta.env.VITE_GTM_ID
  const ga4MeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID

  if (gtmId) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
    const script = document.createElement('script')
    script.async = true
    script.src = getGtmScriptUrl(gtmId)
    document.head.appendChild(script)
  }

  if (ga4MeasurementId && !gtmId) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4MeasurementId)}`
    document.head.appendChild(script)

    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', ga4MeasurementId, { send_page_view: false })
  }
}

export function trackEvent(eventName, eventParams = {}) {
  if (!hasWindow()) return

  window.dataLayer = window.dataLayer || []

  const { attribution, entry } = getAttributionContext()
  const payload = {
    event: eventName,
    event_timestamp: nowIso(),
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_hash: window.location.hash || null,
    source: attribution.source,
    medium: attribution.medium,
    campaign: attribution.campaign,
    content_piece_id: attribution.content_piece_id,
    utm_content: attribution.utm_content,
    utm_term: attribution.utm_term,
    landing_path: entry.landing_path,
    entry_point: entry.entry_point,
    ...eventParams,
  }

  window.dataLayer.push(payload)

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload)
  }
}

export function trackPageView(extraParams = {}) {
  trackEvent('page_view', {
    page_title: document.title,
    ...extraParams,
  })
}

export function trackCtaClick(params) {
  trackEvent('cta_click', params)
}

export function trackContactClick(params) {
  trackEvent('contact_click', params)
}

export function trackOutboundClick(params) {
  trackEvent('outbound_click', params)
}

export function trackLeadFormView(params) {
  trackEvent('lead_form_view', params)
}

export function trackLeadFormSubmit(params) {
  trackEvent('lead_form_submit', params)
}
