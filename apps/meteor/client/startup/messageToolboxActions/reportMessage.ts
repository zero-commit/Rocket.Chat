import type { IMessage } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';

import { messageToolboxActions } from '../../lib/MessageToolboxActions';
import { imperativeModal } from '../../lib/imperativeModal';
import { roomCoordinator } from '../../lib/rooms/roomCoordinator';
import { messageArgs } from '../../lib/utils/messageArgs';
import ReportMessageModal from '../../views/room/modals/ReportMessageModal';

const getMainMessageText = (message: IMessage): IMessage => {
	const newMessage = { ...message };
	newMessage.msg = newMessage.msg || newMessage.attachments?.[0]?.description || newMessage.attachments?.[0]?.title || '';
	newMessage.md = newMessage.md || newMessage.attachments?.[0]?.descriptionMd || undefined;
	return { ...newMessage };
};

Meteor.startup(() => {
	messageToolboxActions.add({
		id: 'report-message',
		icon: 'report',
		label: 'Report',
		context: ['message', 'message-mobile', 'threads', 'federated'],
		variant: 'danger' as const,
		action(this: unknown, _, { message = messageArgs(this).msg }) {
			imperativeModal.open({
				component: ReportMessageModal,
				props: {
					message: getMainMessageText(message),
					onClose: imperativeModal.close,
				},
			});
		},
		condition({ subscription, room }) {
			const isLivechatRoom = roomCoordinator.isLivechatRoom(room.t);
			if (isLivechatRoom) {
				return false;
			}
			return Boolean(subscription);
		},
		order: 17,
		group: 'menu',
	});
});
