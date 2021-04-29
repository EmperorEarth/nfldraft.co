export default function whichRound(pick) {
  if (pick < 33) {
    return 1;
  }
  if (pick < 65) {
    return 2;
  }
  if (pick < 106) {
    return 3;
  }
  if (pick < 145) {
    return 4;
  }
  if (pick < 185) {
    return 5;
  }
  if (pick < 229) {
    return 6;
  }
  return 7;
}
