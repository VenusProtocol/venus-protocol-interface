# i18n Patterns Reference (Venus)

All user-facing text must be internationalized using the Venus i18n stack.
Rules here must match the current Venus repository.

## Import

```typescript
import { Trans, useTranslation } from 'libs/translations';
```

Do not import `react-i18next` directly in feature/page/component code unless a local file already follows that legacy pattern.

## Hook usage

```typescript
const { t } = useTranslation();
```

## Key format - dot path only

```typescript
// Correct
t('trade.title')
t('trade.label.status')
t('common.close') // only if this key already exists in Venus locales

// Wrong
t('my-feature:title.pageHeader')
t('label.status')
```

Use feature-scoped dot-path keys (for example `trade.*`, `markets.*`, `dashboard.*`).

## Locale file location

```txt
apps/evm/src/libs/translations/translations/en.json
```

Other locale files live in the same folder (`zh-Hans.json`, `zh-Hant.json`, etc.).

## Key structure - nested JSON objects

```json
{
  "trade": {
    "title": "Trade",
    "label": {
      "status": "Status"
    },
    "button": {
      "open": "Open"
    }
  }
}
```

Avoid flat-only locale objects for new keys.

## `t()` vs `<Trans>`

### Use `t()` for plain text and interpolation

```typescript
t('trade.label.status')
t('trade.greeting', { name: userName })
t('trade.position.count', { count })
```

### Use `<Trans>` only when JSX is embedded in translated text

```tsx
<Trans
  i18nKey="trade.message.termsNotice"
  components={{
    link: <a href="/terms" target="_blank" rel="noreferrer" />,
  }}
/>
```

## Pluralization

Use i18next plural suffixes in locale JSON:

```json
{
  "trade": {
    "position": {
      "count_one": "{{count}} position",
      "count_other": "{{count}} positions"
    }
  }
}
```

```typescript
t('trade.position.count', { count: 1 });
t('trade.position.count', { count: 5 });
```

## What NOT to translate

- CSS class names
- Enum values / constants
- Currency and token symbols (`USD`, `USDT`, `BTC`, `XVS`)
- Wallet addresses / tx hashes / ids
- API field names and technical identifiers

Translate user-facing accessibility text (for example meaningful `aria-label` text shown to users).

## Extraction workflow

After adding or changing keys:

```bash
yarn extract-translations
```

## Naming guidance

Prefer semantic keys over positional keys.

Good:

- `trade.header.title`
- `trade.form.collateral.available`
- `trade.table.emptyState`

Avoid:

- `trade.rightCard.topLeftText`
- `trade.blueButtonText`
- `temp.label1`
