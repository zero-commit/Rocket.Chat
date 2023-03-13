import { useSetting, usePermission } from '@rocket.chat/ui-contexts';
import { lazy, useMemo } from 'react';

import { roomToolboxActions } from '../../views/room/lib/Toolbox';

roomToolboxActions.add('autotranslate', () => {
	const hasPermission = usePermission('auto-translate');
	const autoTranslateEnabled = useSetting('AutoTranslate_Enabled');
	return useMemo(
		() =>
			hasPermission && autoTranslateEnabled
				? {
						groups: ['channel', 'group', 'direct', 'direct_multiple', 'team'],
						id: 'autotranslate',
						title: 'Auto_Translate',
						icon: 'language',
						template: lazy(() => import('../../views/room/contextualBar/AutoTranslate')),
						order: 20,
						full: true,
				  }
				: null,
		[autoTranslateEnabled, hasPermission],
	);
});
