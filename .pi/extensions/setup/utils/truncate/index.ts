import { DEFAULT_MAX_BYTES, DEFAULT_MAX_LINES } from '../../constants';
import { formatSize } from '../formatSize';

export const truncate = (text: string) => {
  const lines = text.split('\n');
  let bytes = 0;
  const outputLines: string[] = [];

  for (const line of lines) {
    const lineBytes = Buffer.byteLength(`${line}\n`, 'utf8');
    if (outputLines.length >= DEFAULT_MAX_LINES || bytes + lineBytes > DEFAULT_MAX_BYTES) {
      break;
    }

    outputLines.push(line);
    bytes += lineBytes;
  }

  if (outputLines.length === lines.length && bytes <= DEFAULT_MAX_BYTES) {
    return text;
  }

  return `${outputLines.join('\n')}\n\n[Output truncated: ${outputLines.length} of ${
    lines.length
  } lines (${formatSize(bytes)} of ${formatSize(Buffer.byteLength(text, 'utf8'))}).]`;
};
