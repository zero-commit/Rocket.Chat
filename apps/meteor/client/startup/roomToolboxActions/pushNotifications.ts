import { useUserSubscription } from '@rocket.chat/ui-contexts';
import { lazy, useMemo } from 'react';

import { roomToolboxActions } from '../../views/room/lib/Toolbox';

roomToolboxActions.add('push-notifications', ({ room }) => {
	const subscription = useUserSubscription(room?._id);

	return useMemo(
		() =>
			subscription
				? {
						groups: ['channel', 'group', 'direct', 'direct_multiple', 'team'],
						id: 'push-notifications',
						title: 'Notifications_Preferences',
						icon: 'bell',
						template: lazy(() => import('../../views/room/contextualBar/NotificationPreferences')),
						order: 8,
				  }
				: null,
		[subscription],
	);
});
