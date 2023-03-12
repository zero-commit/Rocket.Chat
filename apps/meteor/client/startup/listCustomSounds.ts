import { Meteor } from 'meteor/meteor';

import { CustomSounds } from '../../app/custom-sounds/client/lib/CustomSounds';
import { CachedCollectionManager } from '../../app/ui-cached-collection/client';
import { call } from '../lib/utils/call';

Meteor.startup(() =>
	CachedCollectionManager.onLogin(async () => {
		const result = await call('listCustomSounds');
		for (const sound of result) {
			CustomSounds.add(sound);
		}
	}),
);
