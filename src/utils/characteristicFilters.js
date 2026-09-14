// Light<->Bold and Smooth<->Tannic each resolve to ONE axis (bold, tannic) via a
// min/max threshold that flips at the slider's midpoint — exactly as documented.
// Deliberately not `light` or `soft`, even though those are real separate axes:
// the API guide explicitly warns "smooth" is a synonym for `soft`, not the low end
// of `tannic`, and gives `tannic` as the correct axis for both ends of that slider.
export const CHARACTERISTIC_KEYS = [
  'characteristics[bold][min]',
  'characteristics[bold][max]',
  'characteristics[tannic][min]',
  'characteristics[tannic][max]',
];

export const buildCharacteristicsPatch = (lightBold, smoothTannic) => {
  const patch = {};
  if (lightBold < 50) patch['characteristics[bold][max]'] = ((lightBold / 50) * 10).toFixed(1);
  else if (lightBold > 50) patch['characteristics[bold][min]'] = (((lightBold - 50) / 50) * 10).toFixed(1);

  if (smoothTannic < 50) patch['characteristics[tannic][max]'] = ((smoothTannic / 50) * 10).toFixed(1);
  else if (smoothTannic > 50) patch['characteristics[tannic][min]'] = (((smoothTannic - 50) / 50) * 10).toFixed(1);

  return patch;
};
