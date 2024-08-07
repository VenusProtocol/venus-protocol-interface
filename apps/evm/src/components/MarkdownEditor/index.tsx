import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
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
              'hover border-lightGrey bg-background hover:border-grey focus:border-blue -mt-4 min-h-[12rem] w-full rounded-xl border p-4 font-semibold outline-none transition-colors',
              hasError && 'border-red hover:border-red focus:border-red',
            )}
          />
        ),
      },
      {
        title: t('markdownEditor.previewTabLabel'),
        content: (
          <div className="-mt-4 w-full">
            {value ? (
              <MarkdownViewer className="break-words" content={value} />
            ) : (
              <p className="text-grey">{t('markdownEditor.placeholder')}</p>
            )}
          </div>
        ),
      },
    ],
    [value, hasError, placeholder, t, name, onBlur, onChange],
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
