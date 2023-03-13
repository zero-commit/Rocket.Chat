import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/rocketchat:tap-i18n';

import { messageToolboxActions } from '../../lib/MessageToolboxActions';
import { dispatchToastMessage } from '../../lib/toast';
import { messageArgs } from '../../lib/utils/messageArgs';

Meteor.startup(() => {
	messageToolboxActions.add({
		id: 'permalink',
		icon: 'permalink',
		label: 'Get_link',
		// classes: 'clipboard',
		context: ['message', 'message-mobile', 'threads', 'federated'],
		async action(_, props) {
			try {
				const { message = messageArgs(this).msg } = props;
				const permalink = await messageToolboxActions.getPermaLink(message._id);
				navigator.clipboard.writeText(permalink);
				dispatchToastMessage({ type: 'success', message: TAPi18n.__('Copied') });
			} catch (e) {
				dispatchToastMessage({ type: 'error', message: e });
			}
		},
		condition({ subscription }) {
			return !!subscription;
		},
		order: 4,
		group: 'menu',
	});
});
