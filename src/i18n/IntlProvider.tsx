"use client";

import { NextIntlClientProvider } from "next-intl";
import {
  getMessageFallback,
  handleI18nError,
} from "@portfolio/i18n/config";

type IntlProviderProps = React.ComponentProps<typeof NextIntlClientProvider>;

export function IntlProvider(props: IntlProviderProps) {
  return (
    <NextIntlClientProvider
      {...props}
      onError={handleI18nError}
      getMessageFallback={getMessageFallback}
    />
  );
}
