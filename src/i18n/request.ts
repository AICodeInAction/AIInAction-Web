import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as 'en' | 'zh')) {
    locale = routing.defaultLocale;
  }

  const ui = (await import(`../../messages/${locale}.json`)).default;

  let content = {};
  try {
    content = (await import(`../../messages/${locale}-content.json`)).default;
  } catch {
    // content file is optional
  }

  return {
    locale,
    messages: { ...ui, ...content },
  };
});
