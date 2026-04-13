// returns a date in the format: hh:mm:ss
export function useConvertSecondToTime(duration) {
  let d = Number(duration);
  let h = Math.floor(d / 3600);
  let m = Math.floor((d % 3600) / 60);
  let s = Math.floor((d % 3600) % 60);

  let hDisplay = h > 0 ? h + ':' : '';
  let mDisplay = m < 10 ? '0' + m + ':' : m + ':';
  let sDisplay = s < 10 ? '0' + s : s;

  return hDisplay + mDisplay + sDisplay;
}
