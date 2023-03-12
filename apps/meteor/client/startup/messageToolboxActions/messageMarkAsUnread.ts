import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { ChatSubscription } from '../../../app/models/client';
import { RoomManager, messageToolboxActions } from '../../../app/ui-utils/client';
import { roomCoordinator } from '../../lib/rooms/roomCoordinator';
import { dispatchToastMessage } from '../../lib/toast';
import { call } from '../../lib/utils/call';
import { messageArgs } from '../../lib/utils/messageArgs';

Meteor.startup(() => {
	messageToolboxActions.add({
		id: 'mark-message-as-unread',
		icon: 'flag',
		label: 'Mark_unread',
		context: ['message', 'message-mobile', 'threads'],
		async action(this: unknown, _, { message = messageArgs(this).msg }) {
			try {
				await call('unreadMessages', message);
				const subscription = ChatSubscription.findOne({
					rid: message.rid,
				});
				if (subscription == null) {
					return;
				}
				RoomManager.close(subscription.t + subscription.name);
				return FlowRouter.go('home');
			} catch (error) {
				dispatchToastMessage({ type: 'error', message: error });
			}
		},
		condition({ message, user, room }) {
			const isLivechatRoom = roomCoordinator.isLivechatRoom(room.t);
			if (isLivechatRoom) {
				return false;
			}

			if (!user) {
				return false;
			}

			return message.u._id !== user._id;
		},
		order: 10,
		group: 'menu',
	});
});
