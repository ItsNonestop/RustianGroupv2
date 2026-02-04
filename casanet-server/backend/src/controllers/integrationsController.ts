import { Body, Controller, Get, Put, Response, Route, Security, Tags } from 'tsoa';
import { IntegrationsBlSingleton } from '../business-layer/integrationsBl';
import { ErrorResponse, MockIntegrationsSettings } from '../models/sharedInterfaces';
import { MockIntegrationsSettingsSchema, SchemaValidator } from '../security/schemaValidator';

@Tags('Integrations')
@Route('integrations')
export class IntegrationsController extends Controller {
  /**
   * Get mock integrations settings.
   */
  @Security('adminAuth')
  @Response<ErrorResponse>(501, 'Server error')
  @Get('mock')
  public async getMockIntegrationsSettings(): Promise<MockIntegrationsSettings> {
    return await IntegrationsBlSingleton.getMockIntegrationsSettings();
  }

  /**
   * Update mock integrations settings.
   */
  @Security('adminAuth')
  @Response<ErrorResponse>(501, 'Server error')
  @Put('mock')
  public async setMockIntegrationsSettings(@Body() settings: MockIntegrationsSettings): Promise<void> {
    try {
      const validSettings = await SchemaValidator(settings, MockIntegrationsSettingsSchema);
      return await IntegrationsBlSingleton.setMockIntegrationsSettings(validSettings);
    } catch (error) {
      throw {
        responseCode: 2422,
        message: 'mock integrations settings data incorrect',
      } as ErrorResponse;
    }
  }
}
