export const createKeyGuard = <T extends Record<PropertyKey, unknown>>(
  map: T
) => {
  return (key: PropertyKey): key is keyof T => key in map;
};
