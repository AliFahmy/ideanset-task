import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationService } from '../organization.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OrganizationMemberGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private organizationService: OrganizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const organizationId = request.params.organization_id;

    const organization =
      await this.organizationService.getOrganizationById(organizationId);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    if (user.role === 'admin') {
      return true;
    }

    const isMember = organization.organization_members.includes(user.id);

    if (!isMember) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    return true;
  }
}
