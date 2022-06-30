/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef } from 'react';
import { useStyles } from './styles';

interface IEllipseTextProps {
  className?: string;
  text: string;
  minChars?: number;
}

export const EllipseText: React.FC<IEllipseTextProps> = ({
  children,
  className,
  text,
  minChars = 0,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const styles = useStyles();
  const ellipse = (parentNode: HTMLElement) => {
    const childNode = parentNode.querySelector('.ellipse-text') as HTMLElement;
    if (childNode !== null) {
      childNode.textContent = text;
      const childWidth = childNode.offsetWidth;
      const containerWidth = parentNode.offsetWidth;
      const str = childNode.textContent || '';

      if (childWidth > containerWidth) {
        const textChars = str.length;
        const avgLetterSize = childWidth / textChars;
        const canFit = containerWidth / avgLetterSize;
        let deleteCount = textChars - canFit + 5;
        if (textChars - deleteCount < minChars) {
          deleteCount -= minChars;
        }
        const delEachSide = deleteCount / 2;
        const endLeft = Math.floor(textChars / 2 - delEachSide);
        const startRight = Math.ceil(textChars / 2 + delEachSide);
        childNode.textContent = `${text.slice(0, endLeft)}...${text.slice(startRight)}`;
      }
    }
  };

  useEffect(() => {
    const node = ref.current;
    const parent = node?.parentNode as HTMLElement | null;
    const listener = () => {
      if (node && parent) {
        ellipse(ref.current.offsetWidth > parent.offsetWidth ? parent : node);
      }
    };
    if (node !== null && parent) {
      window.addEventListener('resize', listener);
      ellipse(node.offsetWidth > parent.offsetWidth ? parent : node);
    }
    return () => {
      window?.removeEventListener('resize', listener);
    };
  }, [text]);

  return (
    <div ref={ref} css={styles.root} className={className}>
      {children}
    </div>
  );
};

export default EllipseText;
