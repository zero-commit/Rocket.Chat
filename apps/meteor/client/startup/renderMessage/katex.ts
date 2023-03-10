import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { settings } from '../../../app/settings/client';
import { callbacks } from '../../../lib/callbacks';

Meteor.startup(() => {
	Tracker.autorun(() => {
		const isEnabled = settings.get<boolean>('Katex_Enabled') ?? false;

		if (!isEnabled) {
			callbacks.remove('renderMessage', 'katex');
			return;
		}

		const options = {
			dollarSyntax: settings.get<boolean>('Katex_Dollar_Syntax') ?? false,
			parenthesisSyntax: settings.get<boolean>('Katex_Parenthesis_Syntax') ?? false,
		};

		import('../../../app/katex/client').then(({ createKatexMessageRendering }) => {
			const renderMessage = createKatexMessageRendering(options, true);
			callbacks.remove('renderMessage', 'katex');
			callbacks.add('renderMessage', renderMessage, callbacks.priority.HIGH + 1, 'katex');
		});
	});
});
