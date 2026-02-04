import { IDataIO } from '../models/backendInterfaces';
import { MockIntegrationsSettings } from '../models/sharedInterfaces';
import { DataIO } from './dataIO';

const DEFAULT_MOCK_INTEGRATIONS: MockIntegrationsSettings = {
  temperatureSensor: {
    provider: 'open-meteo',
  },
};

export class IntegrationsDal {
  private dataIo: IDataIO;
  private mockIntegrations: MockIntegrationsSettings[];

  constructor(dataIo: IDataIO) {
    this.dataIo = dataIo;
    this.mockIntegrations = dataIo.getDataSync();
  }

  public async getMockIntegrations(): Promise<MockIntegrationsSettings> {
    const saved = this.mockIntegrations.length > 0 ? this.mockIntegrations[0] : undefined;
    const merged: MockIntegrationsSettings = {
      ...DEFAULT_MOCK_INTEGRATIONS,
      ...saved,
      temperatureSensor: {
        ...DEFAULT_MOCK_INTEGRATIONS.temperatureSensor,
        ...(saved?.temperatureSensor || {}),
      },
    };
    return merged;
  }

  public async setMockIntegrations(settings: MockIntegrationsSettings): Promise<void> {
    this.mockIntegrations = [settings];
    await this.dataIo.setData(this.mockIntegrations).catch(() => {
      throw new Error('fail to save integrations settings request');
    });
  }
}

export const IntegrationsDalSingleton = new IntegrationsDal(new DataIO('integrations.json'));
