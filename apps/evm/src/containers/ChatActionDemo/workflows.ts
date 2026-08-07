/**
 * Hard-coded workflows for the chat action demo.
 *
 * There is no LLM here on purpose: the point of the demo is the *transport* between a
 * conversational surface and the dApp, not the language understanding. Swapping this file for a
 * model call later changes nothing downstream, as long as the model returns the same `ChatIntent`
 * shape.
 *
 * The intent deliberately carries no addresses, no decimals and no amounts in base units — only a
 * token symbol and an action. Resolving that to a vToken/comptroller pair is the app's job (see
 * `resolveIntent`), so the addresses a user is ultimately sent to always come from the app's own
 * market data rather than from whatever produced the message.
 */

export type ChatAction = 'supply' | 'borrow' | 'withdraw' | 'repay';

export interface ChatIntent {
  action: ChatAction;
  symbol: string;
}

export interface WorkflowResult {
  reply: string;
  intent?: ChatIntent;
  ctaLabel?: string;
}

// Symbols the demo is willing to recognise. A closed list, not a free-text field: an unknown symbol
// falls through to the fallback reply instead of building a link to something we cannot verify.
const KNOWN_SYMBOLS = ['USDT', 'USDC', 'BNB', 'BTCB', 'ETH', 'XVS', 'BUSD', 'DAI'];

const SYMBOL_LIST = KNOWN_SYMBOLS.join(', ');

const ACTION_PATTERNS: { action: ChatAction; pattern: RegExp }[] = [
  { action: 'withdraw', pattern: /withdraw|redeem|取出|取回|赎回|提现/i },
  { action: 'repay', pattern: /repay|pay back|还款|还钱|还上/i },
  { action: 'borrow', pattern: /borrow|loan|借出|借入|借点|借/i },
  { action: 'supply', pattern: /supply|deposit|lend|earn|存入|存点|供应|存/i },
];

const ACTION_LABELS: Record<ChatAction, { en: string; cta: string }> = {
  supply: { en: 'supply', cta: 'Open supply form' },
  borrow: { en: 'borrow', cta: 'Open borrow form' },
  withdraw: { en: 'withdraw', cta: 'Open withdraw form' },
  repay: { en: 'repay', cta: 'Open repay form' },
};

// Canned answers that resolve before intent matching. These exist to show that a workflow can be a
// plain reply with no navigation attached.
const CANNED: { pattern: RegExp; reply: string }[] = [
  {
    pattern: /^\s*(hi|hey|hello|你好|在吗)\s*[!?！？.。]*\s*$/i,
    reply:
      'Hi. Try something like "supply USDT", "borrow BNB" or "withdraw USDT" and I will take you straight to the form.',
  },
  {
    pattern: /what can you do|help|怎么用|能做什么|帮助/i,
    reply: `I recognise four actions — supply, borrow, withdraw, repay — on these markets: ${SYMBOL_LIST}. Name an action and a token and I will open the right market page.`,
  },
];

const FALLBACK: WorkflowResult = {
  reply:
    'I did not catch an action and a token in that. Try "supply USDT", "borrow BNB", "withdraw USDT" or "repay USDC".',
};

const findSymbol = (text: string) =>
  KNOWN_SYMBOLS.find(symbol => new RegExp(`\\b${symbol}\\b`, 'i').test(text));

const findAction = (text: string) =>
  ACTION_PATTERNS.find(({ pattern }) => pattern.test(text))?.action;

export const runWorkflow = (input: string): WorkflowResult => {
  const canned = CANNED.find(({ pattern }) => pattern.test(input));

  if (canned) {
    return { reply: canned.reply };
  }

  const symbol = findSymbol(input);
  const action = findAction(input);

  if (!symbol || !action) {
    return FALLBACK;
  }

  return {
    reply: `Taking you to the ${symbol} market, ${ACTION_LABELS[action].en} tab.`,
    intent: { action, symbol },
    ctaLabel: `${ACTION_LABELS[action].cta} · ${symbol}`,
  };
};
