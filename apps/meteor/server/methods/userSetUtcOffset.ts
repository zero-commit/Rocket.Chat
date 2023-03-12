import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Users } from '../../app/models/server';

declare module '@rocket.chat/ui-contexts' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface ServerMethods {
		userSetUtcOffset: (utcOffset: number) => void;
	}
}

Meteor.methods({
	userSetUtcOffset(utcOffset) {
		check(utcOffset, Number);

		if (!this.userId) {
			return;
		}

		return Users.setUtcOffset(this.userId, utcOffset);
	},
});

DDPRateLimiter.addRule(
	{
		type: 'method',
		name: 'userSetUtcOffset',
		userId() {
			return true;
		},
	},
	1,
	60000,
);
