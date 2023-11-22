import { UseCase } from "@shared/domain/useCases/useCase";
import { GetHealthCheckRequest } from '@services/ping/application/useCases/getHealthCheckRequest';
import { HealthCheckResponse } from '@services/ping/application/responses/healthCheckResponse';
import { injectable } from 'tsyringe';

@injectable()
export class GetHealthCheckUseCase extends UseCase<GetHealthCheckRequest, HealthCheckResponse> {
  public async run(request: GetHealthCheckRequest): Promise<HealthCheckResponse> {
    const { requestId } = request;
    return { requestId };
  }
}
