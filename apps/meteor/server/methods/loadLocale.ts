import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { getMomentLocale } from '../lib/getMomentLocale';

declare module '@rocket.chat/ui-contexts' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface ServerMethods {
		loadLocale: (locale: string) => string;
	}
}

Meteor.methods({
	loadLocale(locale: string) {
		check(locale, String);

		try {
			return getMomentLocale(locale);
		} catch (error: any) {
			throw new Meteor.Error(error.message, `Moment locale not found: ${locale}`);
		}
	},
});
