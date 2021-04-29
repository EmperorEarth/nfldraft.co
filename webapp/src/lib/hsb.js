export default function hsb(hue, saturation, brightness) {
  hue /= 360;
  if (saturation > 100 || saturation < 0) {
    throw Error(`invalid saturation. expected 0-1 or 0-100, got ${saturation}`);
  }
  if (saturation > 1) {
    saturation /= 100;
  }
  if (brightness > 100 || brightness < 0) {
    throw Error(`invalid brightness. expected 0-1 or 0-100, got ${brightness}`);
  }
  if (brightness > 1) {
    brightness /= 100;
  }
  if (saturation === 0) {
    return rgbToHexString({
      r: brightness * 255,
      g: brightness * 255,
      b: brightness * 255,
    });
  }
  let i = Math.round(hue * 6.0);
  const f = hue * 6 - i;
  const p = brightness * (1 - saturation);
  const q = brightness * (1 - saturation * f);
  const t = brightness * (1 - saturation * (1 - f));
  i %= 6;
  switch (i) {
    case 0:
      return rgbToHexString({
        r: brightness * 255,
        g: t * 255,
        b: p * 255,
      });
    case 1:
      return rgbToHexString({
        r: q * 255,
        g: brightness * 255,
        b: p * 255,
      });
    case 2:
      return rgbToHexString({
        r: p * 255,
        g: brightness * 255,
        b: t * 255,
      });
    case 3:
      return rgbToHexString({
        r: p * 255,
        g: q * 255,
        b: brightness * 255,
      });
    case 4:
      return rgbToHexString({
        r: t * 255,
        g: p * 255,
        b: brightness * 255,
      });
    case 5:
      return rgbToHexString({
        r: brightness * 255,
        g: p * 255,
        b: q * 255,
      });
    default:
      return rgbToHexString({
        r: 0,
        g: 0,
        b: 0,
      });
  }
}

function rgbToHexString({ r, g, b }) {
  return `#${intToHexString(r)}${intToHexString(g)}${intToHexString(b)}`;
}

function intToHexString(value) {
  const hex = Math.round(value).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}
