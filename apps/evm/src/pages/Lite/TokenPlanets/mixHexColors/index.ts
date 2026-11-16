const CHANNEL_OFFSETS = [1, 3, 5];

export const mixHexColors = ({ from, to, ratio }: { from: string; to: string; ratio: number }) => {
  const channels = CHANNEL_OFFSETS.map(offset =>
    Math.round(
      Number.parseInt(from.slice(offset, offset + 2), 16) * (1 - ratio) +
        Number.parseInt(to.slice(offset, offset + 2), 16) * ratio,
    ),
  );

  return `rgb(${channels.join(',')})`;
};
