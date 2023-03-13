import type { IUser } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';

import { settings } from '../../../app/settings/client';
import { messageToolboxActions } from '../../lib/MessageToolboxActions';
import { queryClient } from '../../lib/queryClient';
import { dispatchToastMessage } from '../../lib/toast';
import { call } from '../../lib/utils/call';
import { messageArgs } from '../../lib/utils/messageArgs';

Meteor.startup(() => {
	messageToolboxActions.add({
		id: 'unstar-message',
		icon: 'star',
		label: 'Unstar_Message',
		context: ['starred', 'message', 'message-mobile', 'threads', 'federated'],
		async action(_, props) {
			const { message = messageArgs(this).msg } = props;

			try {
				await call('starMessage', { ...message, starred: false });
				queryClient.invalidateQueries(['rooms', message.rid, 'starred-messages']);
			} catch (error) {
				dispatchToastMessage({ type: 'error', message: error });
			}
		},
		condition({ message, subscription, user }) {
			if (subscription == null && settings.get('Message_AllowStarring')) {
				return false;
			}

			return Boolean(message.starred?.find((star: Pick<IUser, '_id'>) => star._id === user?._id));
		},
		order: 9,
		group: 'menu',
	});
});
