// i18n key of the acknowledgement checkbox text on the institutional (Fixed-Term) vault supply
// form. The exact disclaimer the supplier is shown (in their language, markup stripped) is hashed
// at supply time and recorded on-chain through `depositWithConsent`, so the on-chain consent
// record always matches the displayed agreement — including after the copy changes. The off-chain
// hash<->text mapping is maintained by Operations.
export const INSTITUTIONAL_VAULT_DISCLAIMER_I18N_KEY = 'vault.modals.institutionalTcsAgreement';
