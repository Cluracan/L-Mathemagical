export const createKeyGuard = <T extends Record<PropertyKey, any>>(map: T) => {
  return (key: PropertyKey): key is keyof T => key in map;
};
