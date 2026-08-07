export interface ChatCta {
  label: string;
  url?: string;
  prompt?: string;
  action?: string;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'bot' | 'notice';
  text: string;
  ctas?: ChatCta[];
  animate?: boolean;
  showRestart?: boolean;
}

export interface StoreState {
  isOpen: boolean;
  messages: ChatMessage[];
  isBusy: boolean;
  isSessionAlive: boolean;
  hasGreeted: boolean;
  nextMessageId: number;
  setIsOpen: (isOpen: boolean) => void;
  appendMessage: (message: Omit<ChatMessage, 'id'>) => void;
  setIsBusy: (isBusy: boolean) => void;
  setIsSessionAlive: (isSessionAlive: boolean) => void;
  setHasGreeted: (hasGreeted: boolean) => void;
}
