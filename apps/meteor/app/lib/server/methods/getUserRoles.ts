import { Meteor } from 'meteor/meteor';
import { Authorization } from '@rocket.chat/core-services';
import type { IUser } from '@rocket.chat/core-typings';

declare module '@rocket.chat/ui-contexts' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface ServerMethods {
		getUserRoles: () => Pick<IUser, '_id' | 'username' | 'roles'>[];
	}
}

Meteor.methods({
	async getUserRoles() {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'getUserRoles' });
		}

		return Authorization.getUsersFromPublicRoles();
	},
});
