import { IntegrationsDal, IntegrationsDalSingleton } from '../data-layer/integrationsDal';
import { MockIntegrationsSettings } from '../models/sharedInterfaces';

export class IntegrationsBl {
  constructor(private integrationsDal: IntegrationsDal) {}

  public async getMockIntegrationsSettings(): Promise<MockIntegrationsSettings> {
    return await this.integrationsDal.getMockIntegrations();
  }

  public async setMockIntegrationsSettings(settings: MockIntegrationsSettings): Promise<void> {
    return await this.integrationsDal.setMockIntegrations(settings);
  }
}

export const IntegrationsBlSingleton = new IntegrationsBl(IntegrationsDalSingleton);
