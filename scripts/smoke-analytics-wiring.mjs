import { readFile } from 'node:fs/promises'

const requirements = {
  'src/App.jsx': [
    'initializeAttribution',
    'initAnalytics',
    'trackPageView',
    'trackLeadFormView',
    'onOpenContactForm={openContactForm}',
  ],
  'src/components/Navbar.jsx': [
    'trackCtaClick',
    'trackContactClick',
    "onOpenContactForm('navbar_desktop_contact')",
    "onOpenContactForm('navbar_mobile_contact')",
  ],
  'src/components/HeroSection.jsx': [
    'trackCtaClick',
    'trackContactClick',
    "cta_id: 'hero_contact_anchor'",
    "cta_id: 'hero_vision_anchor'",
  ],
  'src/components/CTASection.jsx': [
    'trackCtaClick',
    'trackContactClick',
    "onOpenContactForm('cta_section_contact')",
  ],
  'src/components/Footer.jsx': [
    'trackCtaClick',
    'trackContactClick',
    'trackOutboundClick',
    "onOpenContactForm('footer_contact')",
  ],
  'src/components/TeamSection.jsx': [
    'trackOutboundClick',
    "location: 'team_card'",
  ],
  'src/components/ContactFormModal.jsx': [
    'trackLeadFormSubmit',
    'persistLeadFromContactForm',
  ],
}

const failures = []
const forbiddenTokens = {
  'src/components/Footer.jsx': [
    "link_text: 'kondorcorporate@gmail.com'",
  ],
  'src/components/TeamSection.jsx': [
    'outbound_url: primarySocial.href',
    'link_text: `${name}',
  ],
}

for (const [file, expectedTokens] of Object.entries(requirements)) {
  const source = await readFile(file, 'utf8')
  for (const token of expectedTokens) {
    if (!source.includes(token)) {
      failures.push(`${file}: missing ${JSON.stringify(token)}`)
    }
  }

  for (const token of forbiddenTokens[file] ?? []) {
    if (source.includes(token)) {
      failures.push(`${file}: forbidden ${JSON.stringify(token)}`)
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Analytics wiring smoke failed:\n${failures.join('\n')}`)
}

console.log('Analytics wiring smoke passed.')
