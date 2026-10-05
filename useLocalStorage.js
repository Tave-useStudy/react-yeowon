import { useCallback, useState } from 'react';

const STORAGE_VERSION = 1;

function isTodo(value) {
  if (!value || typeof value !== 'object') return false;

  return (
    typeof value.id === 'number' &&
    typeof value.text === 'string' &&
    typeof value.category === 'string' &&
    ['high', 'medium', 'low'].includes(value.priority) &&
    typeof value.done === 'boolean'
  );
}

function readStoredValue(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return fallbackValue;
    }

    const parsed = JSON.parse(rawValue);

    // localStorage의 JSON 모양을 버전과 함께 검증합니다.
    if (
      parsed?.version !== STORAGE_VERSION ||
      !Array.isArray(parsed?.data)
    ) {
      return fallbackValue;
    }

    return parsed.data.filter(isTodo);
  } catch (error) {
    console.warn(
      'localStorage 데이터를 읽지 못해 기본값을 사용합니다.',
      error
    );

    return fallbackValue;
  }
}

export function useLocalStorage(key, fallbackValue) {
  // localStorage 읽기는 첫 렌더에서 한 번만 실행합니다.
  const [initialStoredValue] = useState(() =>
    readStoredValue(key, fallbackValue)
  );

  const saveStoredValue = useCallback(
    (nextValue) => {
      if (typeof window === 'undefined') return;

      try {
        const payload = {
          version: STORAGE_VERSION,
          savedAt: new Date().toISOString(),
          data: nextValue,
        };

        window.localStorage.setItem(
          key,
          JSON.stringify(payload)
        );
      } catch (error) {
        console.error(
          'localStorage 저장에 실패했습니다.',
          error
        );
      }
    },
    [key]
  );

  return [initialStoredValue, saveStoredValue];
}
