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
t('yieldPlus.title')
t('yieldPlus.label.status')
t('common.close') // only if this key already exists in Venus locales

// Wrong
t('my-feature:title.pageHeader')
t('label.status')
```

Use feature-scoped dot-path keys (for example `yieldPlus.*`, `markets.*`, `dashboard.*`).

## Locale file location

```txt
apps/evm/src/libs/translations/translations/en.json
```

Other locale files live in the same folder (`zh-Hans.json`, `zh-Hant.json`, etc.).

## Key structure - nested JSON objects

```json
{
  "yieldPlus": {
    "title": "Yield+",
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
t('yieldPlus.label.status')
t('yieldPlus.greeting', { name: userName })
t('yieldPlus.position.count', { count })
```

### Use `<Trans>` only when JSX is embedded in translated text

```tsx
<Trans
  i18nKey="yieldPlus.message.termsNotice"
  components={{
    link: <a href="/terms" target="_blank" rel="noreferrer" />,
  }}
/>
```

## Pluralization

Use i18next plural suffixes in locale JSON:

```json
{
  "yieldPlus": {
    "position": {
      "count_one": "{{count}} position",
      "count_other": "{{count}} positions"
    }
  }
}
```

```typescript
t('yieldPlus.position.count', { count: 1 });
t('yieldPlus.position.count', { count: 5 });
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

- `yieldPlus.header.title`
- `yieldPlus.form.collateral.available`
- `yieldPlus.table.emptyState`

Avoid:

- `yieldPlus.rightCard.topLeftText`
- `yieldPlus.blueButtonText`
- `temp.label1`
