import { isRoomFederated } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';

import { messageToolboxActions } from '../../../app/ui-utils/client/lib/MessageToolboxActions';
import { roomCoordinator } from '../../lib/rooms/roomCoordinator';
import { messageArgs } from '../../lib/utils/messageArgs';

Meteor.startup(() => {
	messageToolboxActions.add({
		id: 'delete-message',
		icon: 'trash',
		label: 'Delete',
		context: ['message', 'message-mobile', 'threads', 'federated'],
		variant: 'danger' as const,
		action(this: unknown, _, { message = messageArgs(this).msg, chat }) {
			chat?.flows.requestMessageDeletion(message);
		},
		condition({ message, subscription, room, chat }) {
			if (!subscription) {
				return false;
			}
			if (isRoomFederated(room)) {
				return message.u._id === Meteor.userId();
			}
			const isLivechatRoom = roomCoordinator.isLivechatRoom(room.t);
			if (isLivechatRoom) {
				return false;
			}

			return chat?.data.canDeleteMessage(message) ?? false;
		},
		order: 18,
		group: 'menu',
	});
});
