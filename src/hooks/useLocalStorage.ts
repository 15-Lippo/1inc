import { useEffect, useState } from 'react';

function getStorageValue(key: string, defaultValue: any) {
  const saved = localStorage.getItem(key);
  // @ts-ignore
  const initial = JSON.parse(saved);
  return initial || defaultValue;
}

export const useLocalStorage = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    // @ts-ignore
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
