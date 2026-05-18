import { getRequestConfig } from "next-intl/server";
import {
  defaultLocale,
  getMessageFallback,
  handleI18nError,
} from "@portfolio/i18n/config";

export default getRequestConfig(async () => ({
  locale: defaultLocale,
  messages: (await import(`../../messages/${defaultLocale}.json`)).default,
  onError: handleI18nError,
  getMessageFallback,
}));
