export const ONBOARDING_SEEN_STORAGE_KEY = 'venus-interface-onboarding-seen';

export const hasSeenOnboarding = () => {
  try {
    return window.localStorage.getItem(ONBOARDING_SEEN_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const markOnboardingSeen = () => {
  try {
    window.localStorage.setItem(ONBOARDING_SEEN_STORAGE_KEY, 'true');
  } catch {
    return;
  }
};
