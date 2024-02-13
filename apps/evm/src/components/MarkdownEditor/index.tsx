import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';

import { cn } from 'utilities';

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

  const tabsContent = useMemo(
    () => [
      {
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
              'hover -mt-6 min-h-[12rem] w-full rounded-xl border border-lightGrey bg-background p-4 font-semibold outline-none transition-colors hover:border-grey focus:border-blue',
              hasError && 'border-red hover:border-red focus:border-red',
            )}
          />
        ),
      },
      {
        title: t('markdownEditor.previewTabLabel'),
        content: (
          <div className="-mt-6 w-full">
            {value ? (
              <MarkdownViewer className="break-words" content={value} />
            ) : (
              <p className="text-grey">{t('markdownEditor.placeholder')}</p>
            )}
          </div>
        ),
      },
    ],
    [value, hasError, placeholder, t, name],
  );

  return (
    <div className={cn(className)}>
      {!!label && (
        <p className={cn('mb-1 text-sm font-semibold', hasError && 'text-red')}>{label}</p>
      )}

      <Tabs tabsContent={tabsContent} />
    </div>
  );
};
