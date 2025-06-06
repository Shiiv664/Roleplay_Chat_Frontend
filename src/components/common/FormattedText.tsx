import React from 'react';
import type { FormattingSettings } from '../../types';
import { parseFormattedText, stylesToCSS } from '../../utils/textFormatter';

interface FormattedTextProps {
  text: string;
  formattingSettings?: FormattingSettings | null;
  className?: string;
}

const FormattedText: React.FC<FormattedTextProps> = ({ 
  text, 
  formattingSettings, 
  className 
}) => {
  const segments = parseFormattedText(text, formattingSettings);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.rule) {
          const styles = stylesToCSS(segment.rule.styles);
          return (
            <span key={index} style={styles}>
              {segment.content}
            </span>
          );
        }
        return segment.content;
      })}
    </span>
  );
};

export default FormattedText;
