export default function useSortParams(order, params) {
  let sortedParams = {};

  if (params) {
    order.forEach((element) => {
      sortedParams[element] = params[element];
    });
  }

  return sortedParams;
}
