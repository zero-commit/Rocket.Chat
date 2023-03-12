import type { IMessage } from '@rocket.chat/core-typings';
import { Meteor } from 'meteor/meteor';

import notifications from '../../../notifications/server/lib/Notifications';

declare module '@rocket.chat/ui-contexts' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface ServerMethods {
		updateOTRAck: ({ message, ack }: { message: Pick<IMessage, '_id' | 'rid'>; ack: string }) => void;
	}
}

Meteor.methods({
	updateOTRAck({ message, ack }) {
		if (!Meteor.userId()) {
			throw new Meteor.Error('error-invalid-user', 'Invalid user', { method: 'updateOTRAck' });
		}
		const otrStreamer = notifications.streamRoomMessage;
		otrStreamer.emit(message.rid, { ...message, otr: { ack } });
	},
});
