import { useMemo, lazy } from 'react';

import { addAction } from '../../views/room/lib/Toolbox';
import { usePermission } from '../../contexts/AuthorizationContext';

addAction('export-messages', ({ room }) => {
	const hasPermission = usePermission('mail-messages', room._id);
	return useMemo(() => (hasPermission ? {
		groups: ['channel', 'group', 'direct'],
		id: 'export-messages',
		anonymous: true,
		title: 'Export_Messages',
		icon: 'mail',
		template: lazy(() => import('../../views/room/contextualBar/ExportMessages')),
		full: true,
		order: 12 } : null), [hasPermission]);
});
