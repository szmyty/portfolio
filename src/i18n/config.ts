export const defaultLocale = "en" as const;

export function handleI18nError(error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }
}

export function getMessageFallback({
  namespace,
  key,
}: {
  namespace?: string;
  key: string;
}) {
  return namespace ? `${namespace}.${key}` : key;
}
