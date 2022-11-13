const normalizeParams = <
  T extends Partial<Record<string, string | number | boolean>>
>(
  params: T
) => {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([, value]) => value)
      .map(([key, value]) => [key, value?.toString()])
  ) as Record<keyof T, string>;
};

export const getQueryParams = <T extends object>(params: T | undefined) => {
  if (!params) {
    return {};
  }
  return new URLSearchParams(Object.entries(normalizeParams(params)));
};
