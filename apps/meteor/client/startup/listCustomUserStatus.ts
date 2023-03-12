import type { ICustomUserStatus } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { userStatus } from '../../app/user-status/client/lib/userStatus';
import { call } from '../lib/utils/call';

Meteor.startup(() => {
	Tracker.autorun(() => {
		if (!Meteor.userId()) {
			return;
		}

		call('listCustomUserStatus').then((result: ICustomUserStatus[]) => {
			for (const customStatus of result) {
				const newUserStatus = {
					name: customStatus.name,
					id: customStatus._id,
					statusType: customStatus.statusType,
					localizeName: false,
				};

				userStatus.packages.customUserStatus.list.push(newUserStatus);
				userStatus.list[newUserStatus.id] = newUserStatus;
			}
		});
	});
});
