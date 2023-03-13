import { lazy } from 'react';

import { roomToolboxActions } from '../../views/room/lib/Toolbox';

roomToolboxActions.add('user-info-group', {
	groups: ['direct_multiple'],
	id: 'user-info-group',
	title: 'Members',
	icon: 'members',
	template: lazy(() => import('../../views/room/MemberListRouter')),
	order: 1,
});
