export const BOOST_TIERS: { range: string; boost: string; isMax?: boolean }[] = [
  { range: '0 – 29', boost: '1.0×' },
  { range: '30 – 59', boost: '1.3×' },
  { range: '60 – 89', boost: '1.6×' },
  { range: '90+', boost: '2.0×', isMax: true },
];
