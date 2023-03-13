import { lazy } from 'react';

import { roomToolboxActions } from '../../views/room/lib/Toolbox';

roomToolboxActions.add('user-info', {
	groups: ['direct'],
	id: 'user-info',
	title: 'User_Info',
	icon: 'user',
	template: lazy(() => import('../../views/room/MemberListRouter')),
	order: 1,
});
