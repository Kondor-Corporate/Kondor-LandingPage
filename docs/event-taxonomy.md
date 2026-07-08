# Taxonomia de eventos - Piloto Kondor

## Convenciones

- Nombres en `snake_case`.
- Un evento debe describir una accion de negocio o navegacion relevante.
- No enviar PII a GA4/GTM: no nombres, emails, telefonos, empresa ni mensaje libre.
- Todo evento debe incluir atribucion cuando este disponible:
  - `source`
  - `medium`
  - `campaign`
  - `content_piece_id`
  - `utm_content`
  - `utm_term`
  - `landing_path`
  - `entry_point`

## Eventos implementados en Fase 1

### `page_view`

Se dispara al montar la landing.

Parametros principales:

- `page_title`
- `page_path`
- `page_location`
- `source`
- `medium`
- `campaign`
- `content_piece_id`

Uso:

- Medir visitas web basicas.
- Validar atribucion inicial.
- Alimentar GA4 como comportamiento web.

### `cta_click`

Se dispara cuando el usuario toca un CTA relevante.

Parametros:

- `cta_id`
- `cta_label`
- `cta_destination`
- `location`

CTAs iniciales:

- `navbar_desktop_contact`
- `navbar_mobile_contact`
- `hero_contact_anchor`
- `hero_vision_anchor`
- `cta_section_contact`
- `cta_section_portfolio`
- `footer_contact`

### `contact_click`

Se dispara cuando la accion expresa intencion de contacto.

Parametros:

- `contact_type`
- `link_text`
- `location`

Valores actuales de `contact_type`:

- `form_open`
- `section_anchor`
- `email`

Valores reservados para fases posteriores:

- `whatsapp`
- `calendar`
- `call`

### `outbound_click`

Se dispara al salir hacia una plataforma externa.

Parametros:

- `outbound_url`
- `link_text`
- `location`

Ubicaciones iniciales:

- `footer_social`
- `team_card`

### `lead_form_view`

Se dispara cuando se abre el modal de contacto.

Parametros:

- `form_id`
- `cta_id`

Valor actual:

- `form_id=contact_modal`

### `lead_form_submit`

Se dispara cuando el formulario finaliza su intento de envio.

Parametros:

- `form_id`
- `submit_status`
- `has_company`
- `has_message`
- `error_message` solo si falla

Valores de `submit_status`:

- `success`
- `error`
- `spam_filtered`

Nota: este evento no persiste un lead de negocio. La creacion real de lead corresponde a la fase Supabase.

## Eventos reservados para Fase 3

Estos eventos deben persistirse en Supabase/PostgreSQL, no solo en GA4:

- `lead_created`
- `contact_intent_started`
- `contact_form_submitted`
- `lead_qualified`
- `meeting_booked`
- `proposal_sent`
- `lead_won`
- `lead_lost`

## Parametros de atribucion

La landing reconoce:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `content_piece_id`
- `content_piece`
- `cpid`

Regla de `content_piece_id`:

1. Si viene `content_piece_id`, se usa ese valor.
2. Si viene `content_piece`, se usa ese valor.
3. Si viene `cpid`, se usa ese valor.
4. Si no viene ninguno, se usa `utm_content` como fallback.

## Ejemplo de URL trazable

```text
https://kondorcorporate.com/?utm_source=instagram&utm_medium=social&utm_campaign=piloto_julio&utm_content=reel_arquitectura&content_piece_id=ig_reel_2026_07_arquitectura_01
```

## Validacion manual

En local o staging:

1. Abrir la landing con UTMs.
2. Abrir DevTools.
3. Ejecutar `window.dataLayer`.
4. Verificar que existan eventos con `source`, `medium`, `campaign` y `content_piece_id`.
5. En GTM Preview o GA4 DebugView, confirmar que los eventos llegan con los mismos nombres.
