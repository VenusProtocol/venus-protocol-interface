import { useTranslation } from 'libs/translations';

import { DialogExample } from './DialogExample';
import { DialogMessage } from './DialogMessage';
import { FeatureItem } from './FeatureItem';
import { InstallationSteps } from './InstallationSteps';
import { NoteBox } from './NoteBox';
import { SectionCard } from './SectionCard';
import { SectionTitle } from './SectionTitle';
import { SimpleDialog } from './SimpleDialog';
import { TerminalSection } from './TerminalSection';
import { REPO_URL } from './constants';

const Skills: React.FC = () => {
  const { t } = useTranslation();
  const features = [
    {
      title: t('skillsPage.sections.introduction.features.1.title'),
      description: t('skillsPage.sections.introduction.features.1.description'),
    },
    {
      title: t('skillsPage.sections.introduction.features.2.title'),
      description: t('skillsPage.sections.introduction.features.2.description'),
    },
    {
      title: t('skillsPage.sections.introduction.features.3.title'),
      description: t('skillsPage.sections.introduction.features.3.description'),
    },
    {
      title: t('skillsPage.sections.introduction.features.4.title'),
      description: t('skillsPage.sections.introduction.features.4.description'),
    },
    {
      title: t('skillsPage.sections.introduction.features.5.title'),
      description: t('skillsPage.sections.introduction.features.5.description'),
    },
    {
      title: t('skillsPage.sections.introduction.features.6.title'),
      description: t('skillsPage.sections.introduction.features.6.description'),
    },
  ];
  const capabilities = [
    t('skillsPage.sections.verification.dialog1.capabilities.1'),
    t('skillsPage.sections.verification.dialog1.capabilities.2'),
    t('skillsPage.sections.verification.dialog1.capabilities.3'),
    t('skillsPage.sections.verification.dialog1.capabilities.4'),
    t('skillsPage.sections.verification.dialog1.capabilities.5'),
  ];
  const simpleDialogs = [
    {
      userMessage: t('skillsPage.sections.verification.dialog2.user'),
      agentMessage: t('skillsPage.sections.verification.dialog2.agent'),
    },
    {
      userMessage: t('skillsPage.sections.verification.dialog3.user'),
      agentMessage: t('skillsPage.sections.verification.dialog3.agent'),
    },
    {
      userMessage: t('skillsPage.sections.verification.dialog4.user'),
      agentMessage: t('skillsPage.sections.verification.dialog4.agent'),
    },
  ];

  return (
    <div className="min-h-full bg-background text-white leading-[1.6]">
      <div className="py-[60px]">
        <header className="mb-[60px] text-center">
          <h1 className="mb-3 bg-linear-to-r from-blue to-green bg-clip-text text-2xl font-bold text-transparent md:text-[3rem]">
            {t('skillsPage.header.title')}{' '}
            <span className="text-[1.5rem] font-normal text-yellow">
              {t('skillsPage.header.beta')}
            </span>
          </h1>

          <p className="text-[1.2rem] text-light-grey">{t('skillsPage.header.tagline')}</p>
        </header>

        <TerminalSection />

        <div className="mx-auto max-w-[900px] grid grid-cols-1 gap-10">
          <SectionCard>
            <SectionTitle
              icon={t('skillsPage.sections.introduction.icon')}
              title={t('skillsPage.sections.introduction.title')}
            />

            <p className="mb-4 text-[1.05rem] text-light-grey">
              {t('skillsPage.sections.introduction.paragraph1')}
            </p>

            <ul className="my-5 list-none">
              {features.map(feature => (
                <FeatureItem
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </ul>

            <p className="font-semibold text-blue">
              {t('skillsPage.sections.introduction.highlight')}
            </p>
          </SectionCard>

          <SectionCard>
            <SectionTitle
              icon={t('skillsPage.sections.installation.icon')}
              title={t('skillsPage.sections.installation.title')}
            />

            <p className="mb-4 text-[1.05rem] text-light-grey">
              {t('skillsPage.sections.installation.paragraph1')}
            </p>

            <InstallationSteps />

            <NoteBox>
              <strong>{t('skillsPage.sections.installation.note.warningLabel')}</strong>{' '}
              {t('skillsPage.sections.installation.note.warningText')}
              <br />
              <br />
              <strong>{t('skillsPage.sections.installation.note.securityLabel')}</strong>{' '}
              {t('skillsPage.sections.installation.note.securityText')}
            </NoteBox>

            <p className="text-[1.05rem] text-light-grey">
              <strong className="text-white">
                {t('skillsPage.sections.installation.repository.label')}
              </strong>{' '}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="text-blue hover:underline"
              >
                {REPO_URL}
              </a>
            </p>
          </SectionCard>

          <SectionCard>
            <SectionTitle
              icon={t('skillsPage.sections.verification.icon')}
              title={t('skillsPage.sections.verification.title')}
            />

            <p className="mb-4 text-[1.05rem] text-light-grey">
              {t('skillsPage.sections.verification.paragraph1')}
            </p>

            <DialogExample>
              <DialogMessage variant="user">
                {t('skillsPage.sections.verification.dialog1.user')}
              </DialogMessage>

              <DialogMessage variant="agent">
                {t('skillsPage.sections.verification.dialog1.agentIntro')}

                <ul className="mt-2 ml-10 list-disc text-light-grey marker:text-light-grey">
                  {capabilities.map(capability => (
                    <li key={capability}>
                      <em>{capability}</em>
                    </li>
                  ))}
                </ul>

                <em className="text-light-grey">
                  {t('skillsPage.sections.verification.dialog1.agentOutro')}
                </em>
              </DialogMessage>
            </DialogExample>

            <p className="mb-4 text-[1.05rem] text-light-grey">
              {t('skillsPage.sections.verification.paragraph2')}
            </p>

            {simpleDialogs.map(dialog => (
              <SimpleDialog
                key={dialog.userMessage}
                userMessage={dialog.userMessage}
                agentMessage={dialog.agentMessage}
              />
            ))}

            <p className="font-semibold text-blue">
              {t('skillsPage.sections.verification.highlight')}
            </p>

            <NoteBox>
              <strong>{t('skillsPage.sections.verification.tip.label')}</strong>{' '}
              {t('skillsPage.sections.verification.tip.text')}
            </NoteBox>
          </SectionCard>
        </div>

        <footer className="pt-25 text-center text-light-grey">
          <p>{t('skillsPage.footer.tagline')}</p>
        </footer>
      </div>
    </div>
  );
};

export default Skills;
