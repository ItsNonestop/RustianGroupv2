import { Button, Grid, MenuItem, TextField, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DEFAULT_SUCCEED_ICON_SHOWN } from "../../../infrastructure/consts";
import { sessionManager } from "../../../infrastructure/session-manager";
import { handleServerRestError, notificationsFeed } from "../../../services/notifications.service";
import { getMockIntegrationsSettings, setMockIntegrationsSettings } from "../../../services/integrations.service";

interface MinionMockIntegrationsProps {
	fontRatio: number;
}

const DEFAULT_PROVIDER = 'open-meteo';

export function MinionMockIntegrations(props: MinionMockIntegrationsProps) {
	const { fontRatio } = props;
	const { t } = useTranslation();
	const [loading, setLoading] = useState<boolean>(false);
	const [saving, setSaving] = useState<boolean>(false);
	const [provider, setProvider] = useState<string>(DEFAULT_PROVIDER);
	const [openWeatherApiKey, setOpenWeatherApiKey] = useState<string>('');

	const openWeatherRequired = provider === 'openweather';
	const isSaveDisabled = saving || loading || (openWeatherRequired && !openWeatherApiKey);
	const showAdminOnly = !sessionManager.isAdmin;

	useEffect(() => {
		if (showAdminOnly) {
			return;
		}
		(async () => {
			setLoading(true);
			try {
				const settings = await getMockIntegrationsSettings();
				setProvider(settings?.temperatureSensor?.provider || DEFAULT_PROVIDER);
				setOpenWeatherApiKey(settings?.temperatureSensor?.openWeatherApiKey || '');
			} catch (error) {
				await handleServerRestError(error);
			}
			setLoading(false);
		})();
	}, [showAdminOnly]);

	async function save() {
		setSaving(true);
		try {
			await setMockIntegrationsSettings({
				temperatureSensor: {
					provider: provider as 'open-meteo' | 'openweather',
					openWeatherApiKey: openWeatherApiKey || undefined,
				},
			});
			notificationsFeed.post({
				messageKey: 'dashboard.minions.advanced.settings.mock.integrations.saved',
				duration: DEFAULT_SUCCEED_ICON_SHOWN,
			});
		} catch (error) {
			await handleServerRestError(error);
		}
		setSaving(false);
	}

	if (showAdminOnly) {
		return null;
	}

	return <Grid
		style={{ width: '100%', paddingTop: fontRatio * 0.2 }}
		container
		direction="column"
		justifyContent="center"
		alignItems="stretch"
	>
		<Typography style={{ fontSize: fontRatio * 0.3 }}>
			{t('dashboard.minions.advanced.settings.mock.integrations.title')}
		</Typography>
		<TextField
			select
			disabled={loading || saving}
			value={provider}
			onChange={(event) => setProvider(event.target.value)}
			style={{ marginTop: fontRatio * 0.2 }}
			label={t('dashboard.minions.advanced.settings.mock.integrations.provider')}
		>
			<MenuItem value="open-meteo">
				{t('dashboard.minions.advanced.settings.mock.integrations.provider.openmeteo')}
			</MenuItem>
			<MenuItem value="openweather">
				{t('dashboard.minions.advanced.settings.mock.integrations.provider.openweather')}
			</MenuItem>
		</TextField>
		<TextField
			disabled={loading || saving || !openWeatherRequired}
			value={openWeatherApiKey}
			onChange={(event) => setOpenWeatherApiKey(event.target.value)}
			style={{ marginTop: fontRatio * 0.2 }}
			label={t('dashboard.minions.advanced.settings.mock.integrations.key')}
			placeholder={t('dashboard.minions.advanced.settings.mock.integrations.key')}
			helperText={openWeatherRequired ? t('dashboard.minions.advanced.settings.mock.integrations.key.helper') : ''}
			error={openWeatherRequired && !openWeatherApiKey}
		/>
		<Button
			variant="contained"
			disabled={isSaveDisabled}
			onClick={save}
			style={{ marginTop: fontRatio * 0.2 }}
		>
			{t('dashboard.minions.advanced.settings.mock.integrations.save')}
		</Button>
	</Grid>;
}
