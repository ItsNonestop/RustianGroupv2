import { API_KEY_HEADER } from "../infrastructure/consts";
import { envFacade } from "../infrastructure/env-facade";
import { sessionManager } from "../infrastructure/session-manager";

export type WeatherProvider = 'open-meteo' | 'openweather';

export interface MockTemperatureIntegrationSettings {
	provider: WeatherProvider;
	openWeatherApiKey?: string;
}

export interface MockIntegrationsSettings {
	temperatureSensor: MockTemperatureIntegrationSettings;
}

function getAuthHeaders(): Record<string, string> {
	const headers: Record<string, string> = {
		'content-type': 'application/json',
	};
	const token = sessionManager.getToken();
	if (token) {
		headers[API_KEY_HEADER] = token;
	}
	return headers;
}

export async function getMockIntegrationsSettings(): Promise<MockIntegrationsSettings> {
	const response = await fetch(`${envFacade.apiUrl}/integrations/mock`, {
		method: 'GET',
		headers: getAuthHeaders(),
		credentials: 'include',
	});

	if (!response.ok) {
		throw response;
	}

	return await response.json();
}

export async function setMockIntegrationsSettings(settings: MockIntegrationsSettings): Promise<void> {
	const response = await fetch(`${envFacade.apiUrl}/integrations/mock`, {
		method: 'PUT',
		headers: getAuthHeaders(),
		credentials: 'include',
		body: JSON.stringify(settings),
	});

	if (!response.ok) {
		throw response;
	}
}
