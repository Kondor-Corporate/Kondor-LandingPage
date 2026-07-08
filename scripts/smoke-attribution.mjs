import assert from 'node:assert/strict'
import { getAttributionContext, initializeAttribution, trackEvent } from '../src/lib/analytics.js'

class MemoryStorage {
  constructor() {
    this.values = new Map()
  }

  getItem(key) {
    return this.values.get(key) ?? null
  }

  setItem(key, value) {
    this.values.set(key, String(value))
  }

  clear() {
    this.values.clear()
  }
}

const localStorage = new MemoryStorage()
const sessionStorage = new MemoryStorage()

function setLocation(url, referrer = '') {
  const parsedUrl = new URL(url)

  globalThis.window = {
    location: {
      href: parsedUrl.href,
      hostname: parsedUrl.hostname,
      pathname: parsedUrl.pathname,
      search: parsedUrl.search,
      hash: parsedUrl.hash,
    },
    localStorage,
    sessionStorage,
    dataLayer: [],
  }
  globalThis.document = {
    referrer,
    title: 'Kondor Corporate',
  }
}

try {
  setLocation(
    'https://kondorcorporate.com/?utm_source=instagram&utm_medium=social&utm_campaign=phase_5&utm_content=reel_42&content_piece_id=piece_42',
  )

  const captured = initializeAttribution()
  assert.equal(captured.source, 'instagram')
  assert.equal(captured.medium, 'social')
  assert.equal(captured.campaign, 'phase_5')
  assert.equal(captured.utm_content, 'reel_42')
  assert.equal(captured.content_piece_id, 'piece_42')

  setLocation('https://kondorcorporate.com/servicios#contacto')
  const retained = initializeAttribution()
  const retainedContext = getAttributionContext()

  assert.equal(retained.source, 'instagram')
  assert.equal(retained.campaign, 'phase_5')
  assert.equal(retainedContext.entry.landing_path, '/')
  assert.match(retainedContext.entry.entry_point, /utm_source=instagram/)

  trackEvent('cta_click', { cta_id: 'phase5_smoke_cta' })
  const trackedEvent = window.dataLayer.at(-1)

  assert.equal(trackedEvent.event, 'cta_click')
  assert.equal(trackedEvent.source, 'instagram')
  assert.equal(trackedEvent.medium, 'social')
  assert.equal(trackedEvent.campaign, 'phase_5')
  assert.equal(trackedEvent.content_piece_id, 'piece_42')
  assert.equal(trackedEvent.cta_id, 'phase5_smoke_cta')

  localStorage.clear()
  sessionStorage.clear()
  setLocation('https://kondorcorporate.com/', 'https://www.linkedin.com/feed/update/123')

  const referral = initializeAttribution()
  assert.equal(referral.source, 'www.linkedin.com')
  assert.equal(referral.medium, 'referral')

  localStorage.clear()
  sessionStorage.clear()
  setLocation('https://kondorcorporate.com/')

  const direct = initializeAttribution()
  assert.equal(direct.source, 'direct')
  assert.equal(direct.medium, 'none')

  console.log(
    JSON.stringify({
      explicitUtms: 'verified',
      sessionRetention: 'verified',
      entryContext: 'verified',
      dataLayerAttribution: 'verified',
      referralFallback: 'verified',
      directFallback: 'verified',
    }),
  )
} finally {
  delete globalThis.window
  delete globalThis.document
}
