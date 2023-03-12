import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/rocketchat:tap-i18n';
import { Tracker } from 'meteor/tracker';
import moment from 'moment';

import { Users } from '../../app/models/client';
import { settings } from '../../app/settings/client';
import { call } from '../lib/utils/call';
import { filterLanguage } from '../lib/utils/filterLanguage';
import { isRTLScriptLanguage } from '../lib/utils/isRTLScriptLanguage';

const currentLanguage = new ReactiveVar<string | null>(null);

Meteor.startup(() => {
	TAPi18n.conf.i18n_files_route = Meteor._relativeToSiteRootUrl('/tap-i18n');
	currentLanguage.set(Meteor._localStorage.getItem('userLanguage'));

	const availableLanguages = TAPi18n.getLanguages();

	const getBrowserLanguage = (): string => filterLanguage(window.navigator.userLanguage ?? window.navigator.language);

	const loadMomentLocale = async (language: string): Promise<string> => {
		if (moment.locales().includes(language.toLowerCase())) {
			return language;
		}

		const localeSrc = await call('loadLocale', language);
		Function(localeSrc).call({ moment });
		return language;
	};

	const applyLanguage = (language: string | undefined = 'en'): void => {
		language = filterLanguage(language);

		if (!availableLanguages[language]) {
			language = language.split('-').shift();
		}

		if (!language) {
			return;
		}
		document.documentElement.classList[isRTLScriptLanguage(language) ? 'add' : 'remove']('rtl');
		document.documentElement.setAttribute('dir', isRTLScriptLanguage(language) ? 'rtl' : 'ltr');
		document.documentElement.lang = language;

		TAPi18n.setLanguage(language);
		loadMomentLocale(language)
			.then((locale) => moment.locale(locale))
			.catch((error) => {
				moment.locale('en');
				console.error('Error loading moment locale:', error);
			});
	};

	const setLanguage = (language: string): void => {
		const lang = filterLanguage(language);
		currentLanguage.set(lang);
		Meteor._localStorage.setItem('userLanguage', lang);
	};
	window.setLanguage = setLanguage;

	const defaultUserLanguage = (): string => settings.get('Language') || getBrowserLanguage() || 'en';
	window.defaultUserLanguage = defaultUserLanguage;

	Tracker.autorun(() => {
		const uid = Meteor.userId();
		if (!uid) {
			return;
		}

		const user = Users.findOne(uid, { fields: { language: 1 } });

		setLanguage(user?.language || defaultUserLanguage());
	});

	Tracker.autorun(() => {
		const language = currentLanguage.get();
		if (language) {
			applyLanguage(language);
		}
	});
});
