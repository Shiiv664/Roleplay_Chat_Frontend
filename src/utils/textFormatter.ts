import type { FormattingSettings, FormattingRule } from '../types';

export interface FormattedSegment {
  content: string;
  rule?: FormattingRule;
}

/**
 * Default formatting rules for roleplay chats
 */
export const DEFAULT_FORMATTING_RULES: FormattingRule[] = [
  {
    id: 'actions',
    delimiter: '*',
    name: 'Actions',
    styles: {
      fontStyle: 'italic',
      color: '#8B4513',
      fontFamily: 'Georgia, serif'
    },
    enabled: true
  },
  {
    id: 'speech',
    delimiter: '"',
    name: 'Speech',
    styles: {
      color: '#228B22',
      fontFamily: 'Arial, sans-serif'
    },
    enabled: true
  }
  ,
  {
    id: 'thoughts',
    delimiter: '~',
    name: 'Thoughts',
    styles: {
      fontStyle: 'italic',
      color: '#4169E1',
      fontSize: '0.9em',
      fontFamily: 'Times New Roman, serif'
    },
    enabled: true
  },
  {
    id: 'emphasis',
    delimiter: '_',
    name: 'Emphasis',
    styles: {
      fontWeight: 'bold',
      color: '#DC143C'
    },
    enabled: true
  }
];

/**
 * Parse text and apply formatting rules to create formatted segments
 */
export function parseFormattedText(text: string, settings?: FormattingSettings | null): FormattedSegment[] {
  if (!settings || !settings.enabled || !settings.rules.length) {
    return [{ content: text }];
  }

  const activeRules = settings.rules.filter(rule => rule.enabled);
  if (!activeRules.length) {
    return [{ content: text }];
  }

  const segments: FormattedSegment[] = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    let nextMatch: { index: number; rule: FormattingRule; endIndex: number } | null = null;

    // Find the earliest matching delimiter
    for (const rule of activeRules) {
      const startIndex = text.indexOf(rule.delimiter, currentIndex);
      if (startIndex !== -1) {
        // Look for closing delimiter
        const endDelimiterIndex = text.indexOf(rule.delimiter, startIndex + rule.delimiter.length);
        if (endDelimiterIndex !== -1) {
          if (!nextMatch || startIndex < nextMatch.index) {
            nextMatch = {
              index: startIndex,
              rule,
              endIndex: endDelimiterIndex + rule.delimiter.length
            };
          }
        }
      }
    }

    if (nextMatch) {
      // Add any text before the match as unstyled
      if (nextMatch.index > currentIndex) {
        segments.push({
          content: text.slice(currentIndex, nextMatch.index)
        });
      }

      // Add the formatted segment (excluding delimiters)
      const contentStart = nextMatch.index + nextMatch.rule.delimiter.length;
      const contentEnd = nextMatch.endIndex - nextMatch.rule.delimiter.length;
      segments.push({
        content: text.slice(contentStart, contentEnd),
        rule: nextMatch.rule
      });

      currentIndex = nextMatch.endIndex;
    } else {
      // No more matches, add remaining text
      segments.push({
        content: text.slice(currentIndex)
      });
      break;
    }
  }

  return segments;
}

/**
 * Convert FormattingRule styles to CSS style object
 */
export function stylesToCSS(styles: FormattingRule['styles']): React.CSSProperties {
  const cssStyles: React.CSSProperties = {};

  if (styles.fontWeight) cssStyles.fontWeight = styles.fontWeight;
  if (styles.fontStyle) cssStyles.fontStyle = styles.fontStyle;
  if (styles.textDecoration) cssStyles.textDecoration = styles.textDecoration;
  if (styles.fontSize) cssStyles.fontSize = styles.fontSize;
  if (styles.color) cssStyles.color = styles.color;
  if (styles.backgroundColor) cssStyles.backgroundColor = styles.backgroundColor;
  if (styles.fontFamily) cssStyles.fontFamily = styles.fontFamily;

  return cssStyles;
}

/**
 * Create default formatting settings
 */
export function createDefaultFormattingSettings(): FormattingSettings {
  return {
    enabled: true,
    rules: DEFAULT_FORMATTING_RULES
  };
}
