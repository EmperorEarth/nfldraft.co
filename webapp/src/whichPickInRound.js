export default function whichPickInRound(pick) {
  if (pick < 33) {
    return pick;
  }
  if (pick < 65) {
    return pick - 32;
  }
  if (pick < 106) {
    return pick - 64;
  }
  if (pick < 145) {
    return pick - 105;
  }
  if (pick < 185) {
    return pick - 144;
  }
  if (pick < 229) {
    return pick - 184;
  }
  return pick - 228;
}
