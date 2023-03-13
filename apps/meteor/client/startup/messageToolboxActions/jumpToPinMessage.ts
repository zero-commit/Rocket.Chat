import { Meteor } from 'meteor/meteor';

import { messageToolboxActions } from '../../lib/MessageToolboxActions';
import { messageArgs } from '../../lib/utils/messageArgs';
import { setMessageJumpQueryStringParameter } from '../../lib/utils/setMessageJumpQueryStringParameter';

Meteor.startup(() => {
	messageToolboxActions.add({
		id: 'jump-to-pin-message',
		icon: 'jump',
		label: 'Jump_to_message',
		context: ['pinned', 'message-mobile', 'direct'],
		action(_, props) {
			const { message = messageArgs(this).msg } = props;
			setMessageJumpQueryStringParameter(message._id);
		},
		condition({ subscription }) {
			return !!subscription;
		},
		order: 100,
		group: ['message', 'menu'],
	});
});
