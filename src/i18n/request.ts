import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
    // Await the locale from the request
    const locale = await requestLocale;

    // Validate that the incoming locale is valid
    const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale;

    return {
        locale: validLocale,
        messages: (await import(`./messages/${validLocale}.json`)).default,
    };
});
