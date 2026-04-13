export function useConvertedToStore(arr) {
  let result = {};

  for (const element of arr) {
    const splitted = element.split('_');
    const key = splitted[0].toLowerCase();
    result[key] = splitted[1];
  }

  return result;
}
