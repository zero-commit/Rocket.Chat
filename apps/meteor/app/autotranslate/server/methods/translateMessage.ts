import { Meteor } from 'meteor/meteor';
import type { IMessage } from '@rocket.chat/core-typings';

import { Rooms } from '../../../models/server';
import { TranslationProviderRegistry } from '..';

declare module '@rocket.chat/ui-contexts' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface ServerMethods {
		'autoTranslate.translateMessage': (message?: IMessage, targetLanguage?: string) => void;
	}
}

Meteor.methods({
	'autoTranslate.translateMessage'(message?: IMessage, targetLanguage?: string) {
		if (!TranslationProviderRegistry.enabled) {
			return;
		}
		const room = Rooms.findOneById(message?.rid);
		if (message && room) {
			TranslationProviderRegistry.translateMessage(message, room, targetLanguage);
		}
	},
});
