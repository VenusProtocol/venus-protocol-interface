import { type Hex, keccak256, toBytes } from 'viem';

// Canonical disclaimer the supplier agrees to via the acknowledgement checkbox on the
// institutional (Fixed-Term) vault supply form. This exact text is the consented content:
// its keccak256 hash is recorded on-chain on every supply through `depositWithConsent`, and
// the off-chain mapping between this text and its hash is maintained by Operations.
// It must stay in sync with the displayed agreement (`vault.modals.institutionalTcsAgreement`).
export const INSTITUTIONAL_VAULT_DISCLAIMER =
  'By proceeding, I agree to the Venus Fixed-Term Vault Terms of Use and represent that I am not a restricted person. Restricted persons include US Persons (as defined under Regulation S of the US Securities Act of 1933), persons located in, ordinarily resident in, or nationals of the United Kingdom, Canada, or mainland China, and any person located in or subject to the sanctions laws of an OFAC-sanctioned jurisdiction. See the Terms of Use for the full list.';

export const INSTITUTIONAL_VAULT_CONSENT_HASH: Hex = keccak256(
  toBytes(INSTITUTIONAL_VAULT_DISCLAIMER),
);
