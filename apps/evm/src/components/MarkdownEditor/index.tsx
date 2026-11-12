import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';

import { MarkdownViewer } from '../MarkdownViewer';
import { Tabs } from '../Tabs';

export interface MarkdownEditorProps {
  value: string;
  onChange: (text: string | undefined) => void;
  name: string;
  placeholder: string;
  hasError?: boolean;
  className?: string;
  label?: string;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement, Element>) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  name,
  placeholder,
  hasError,
  className,
  label,
  onBlur,
}) => {
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'markdown',
      title: t('markdownEditor.markdownTabLabel'),
      content: (
        <textarea
          name={name}
          placeholder={placeholder}
          onChange={e => onChange(e.currentTarget.value)}
          onBlur={onBlur}
          value={value}
          data-hasError={hasError}
          className={cn(
            'hover border-muted bg-surface-2 hover:border-bold focus:border-brand -mt-4 min-h-[12rem] w-full rounded-xl border p-4 font-semibold outline-hidden transition-colors',
            hasError && 'border-danger hover:border-danger focus:border-danger',
          )}
        />
      ),
    },
    {
      id: 'preview',
      title: t('markdownEditor.previewTabLabel'),
      content: (
        <div className="-mt-4 w-full">
          {value ? (
            <MarkdownViewer className="wrap-break-word" content={value} />
          ) : (
            <p className="text-secondary">{t('markdownEditor.placeholder')}</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={cn(className)}>
      {!!label && (
        <p className={cn('mb-1 text-sm font-semibold', hasError && 'text-danger')}>{label}</p>
      )}

      <Tabs tabs={tabs} />
    </div>
  );
};
