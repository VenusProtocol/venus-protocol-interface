import { useTranslation } from 'libs/translations';

import { InstallationStep } from '../InstallationStep';
import { REPO_URL } from '../constants';

export const InstallationSteps: React.FC = () => {
  const { Trans } = useTranslation();

  const installationSteps = [
    {
      step: 1,
      text: (
        <Trans
          i18nKey="skillsPage.sections.installation.steps.1.text"
          components={{
            Bold: <strong />,
            RepoLink: (
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="text-blue hover:underline"
              >
                official repository
              </a>
            ),
          }}
        />
      ),
    },
    {
      step: 2,
      text: (
        <Trans
          i18nKey="skillsPage.sections.installation.steps.2.text"
          components={{
            Bold: <strong />,
          }}
        />
      ),
      code: '~/.openclaw/workspace/skills/venus-protocol-ops/',
    },
    {
      step: 3,
      text: (
        <Trans
          i18nKey="skillsPage.sections.installation.steps.3.text"
          components={{
            Bold: <strong />,
          }}
        />
      ),
      code: `PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://bsc-dataseed.binance.org/
CHAIN_ID=56`,
    },
    {
      step: 4,
      text: (
        <Trans
          i18nKey="skillsPage.sections.installation.steps.4.text"
          components={{
            Bold: <strong />,
          }}
        />
      ),
      code: `cd ~/.openclaw/workspace/skills/venus-protocol-ops/
npm install ethers dotenv
pip install requests python-dotenv`,
    },
    {
      step: 5,
      text: (
        <Trans
          i18nKey="skillsPage.sections.installation.steps.5.text"
          components={{
            Bold: <strong />,
          }}
        />
      ),
    },
  ];

  return (
    <ol className="my-5 list-none">
      {installationSteps.map(step => (
        <InstallationStep key={step.step} step={step.step} text={step.text} code={step.code} />
      ))}
    </ol>
  );
};
