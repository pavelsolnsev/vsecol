export function useConvertedToQuery(path) {
  let result = '';
  for (const key in path) {
    if (key === 'level' && path[key]) {
      result += `${key}_${path[key].split(',').join('-')}/`;
    }
    if (path[key] !== undefined && key !== 'page' && key !== 'level') {
      if ((key === 'subject' && path[key] === 'moskva') || (key === 'subject' && path[key] === 'sankt-peterburg')) {
      } else {
        result += `${key}_${path[key]}/`;
      }
    }
  }

  return result;
}
