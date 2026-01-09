import React from "react";
import { z } from "zod";

export function usePersistedZodSchemaState<T>(
  key: string,
  schema: z.ZodType<T>,
  initialValue: () => T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, rawSetState] = React.useState(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        const parsed = JSON.parse(item);
        const validated = schema.parse(parsed);
        return validated;
      } catch (e) {
        console.warn(`Corrupted localStorage data for ${key}, clearing and using defaults:`, e);
        try {
          window.localStorage.removeItem(key);
        } catch (storageError) {
          console.warn("Failed to clear localStorage:", storageError);
        }
        return initialValue();
      }
    }
    return initialValue();
  });
  React.useEffect(() => {
    try {
      const validated = schema.parse(state);
      const data = JSON.stringify(validated);
      window.localStorage.setItem(key, data);
    } catch (e) {
      console.error("Failed to save state to localStorage:", e);
      // Don't save corrupted data
    }
  }, [key, schema, state]);
  const setState = React.useCallback(
    (newState: React.SetStateAction<T>) => {
      rawSetState((oldState) => {
        try {
          if (typeof newState === "function") {
            const result = (newState as (x: T) => T)(oldState);
            return schema.parse(result);
          } else {
            return schema.parse(newState);
          }
        } catch (e) {
          console.error("Invalid state update, keeping previous state:", e);
          return oldState;
        }
      });
    },
    [schema],
  );
  return [state, setState];
}
