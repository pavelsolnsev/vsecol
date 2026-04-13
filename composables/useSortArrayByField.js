export default function useSortArrayByField(array, field) {
  return array.sort((a, b) => {
    // nulls sort after anything else
    if (a[field] === null) {
      return 1;
    }
    if (b[field] === null) {
      return -1;
    }

    if (a[field] < b[field]) {
      return -1;
    }

    if (a[field] > b[field]) {
      return 1;
    }

    return 0;
  });
}
