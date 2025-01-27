import type { Box } from '@rocket.chat/fuselage';
import { Menu, Option } from '@rocket.chat/fuselage';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';
import { HeaderToolboxAction, HeaderToolboxDivider } from '@rocket.chat/ui-client';
import type { TranslationKey } from '@rocket.chat/ui-contexts';
import { useLayout, useTranslation } from '@rocket.chat/ui-contexts';
import type { ComponentProps, ReactElement } from 'react';
import React, { memo, useRef } from 'react';

// used to open the menu option by keyboard
import { useToolboxContext, useTab, useTabBarOpen } from '../../contexts/ToolboxContext';
import type { ToolboxActionConfig, OptionRenderer } from '../../lib/Toolbox';

const renderMenuOption: OptionRenderer = ({ label: { title, icon }, ...props }: any) => (
	<Option label={title} icon={icon} data-qa-id={`ToolBoxAction-${icon}`} gap={!icon} {...props} />
);

type RoomToolboxProps = {
	className?: ComponentProps<typeof Box>['className'];
};

const RoomToolbox = ({ className }: RoomToolboxProps) => {
	const t = useTranslation();
	const tab = useTab();
	const openTabBar = useTabBarOpen();
	const { isMobile } = useLayout();
	const hiddenActionRenderers = useRef<{ [key: string]: OptionRenderer }>({});

	const { actions: mapActions } = useToolboxContext();

	const actions = (Array.from(mapActions.values()) as ToolboxActionConfig[]).sort((a, b) => (a.order || 0) - (b.order || 0));
	const featuredActions = actions.filter((action) => action.featured);
	const filteredActions = actions.filter((action) => !action.featured);
	const visibleActions = isMobile ? [] : filteredActions.slice(0, 6);

	const hiddenActions: Record<string, ToolboxActionConfig> = Object.fromEntries(
		(isMobile ? actions : filteredActions.slice(6))
			.filter((item) => !item.disabled)
			.map((item) => {
				hiddenActionRenderers.current = {
					...hiddenActionRenderers.current,
					[item.id]: item.renderOption || renderMenuOption,
				};
				return [
					item.id,
					{
						label: { title: t(item.title), icon: item.icon },
						action: (): void => {
							openTabBar(item.id);
						},
						...item,
					},
				];
			}),
	);

	const actionDefault = useMutableCallback((actionId) => {
		openTabBar(actionId);
	});

	return (
		<>
			{featuredActions.map(
				({ renderAction, id, icon, title, action = actionDefault, disabled, 'data-tooltip': dataTooltip, tooltip }, index) => {
					const props = {
						id,
						icon,
						title: t(title),
						className,
						index,
						pressed: id === tab?.id,
						action,
						disabled,
						...(dataTooltip ? { 'data-tooltip': t(dataTooltip as TranslationKey) } : {}),
						...(tooltip ? { tooltip } : {}),
					};
					if (renderAction) {
						return renderAction(props);
					}
					return <HeaderToolboxAction {...props} key={id} />;
				},
			)}
			{featuredActions.length > 0 && <HeaderToolboxDivider />}
			{visibleActions.map(
				({ renderAction, id, icon, title, action = actionDefault, disabled, 'data-tooltip': dataTooltip, tooltip }, index) => {
					const props = {
						id,
						icon,
						title: t(title),
						className,
						index,
						pressed: id === tab?.id,
						action,
						disabled,
						...(dataTooltip ? { 'data-tooltip': t(dataTooltip as TranslationKey) } : {}),
						...(tooltip ? { tooltip } : {}),
					};
					if (renderAction) {
						return renderAction(props);
					}
					return <HeaderToolboxAction {...props} key={id} />;
				},
			)}
			{(filteredActions.length > 6 || isMobile) && (
				<Menu
					data-qa-id='ToolBox-Menu'
					tiny={!isMobile}
					title={t('Options')}
					maxHeight='initial'
					className={className}
					aria-keyshortcuts='alt'
					tabIndex={-1}
					options={hiddenActions}
					renderItem={({ value, ...props }): ReactElement | null => value && (hiddenActionRenderers.current[value](props) as ReactElement)}
				/>
			)}
		</>
	);
};

export default memo(RoomToolbox);
