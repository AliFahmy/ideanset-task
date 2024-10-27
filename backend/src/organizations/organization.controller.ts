import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDTO } from './dto/create-organization.dto';
import { ZodValidationPipe } from 'pipes/zod.validation.pipe';
import { createOrganizationSchema } from './validation/create-organization.validation';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateOrganizationDTO } from './dto/update-organization.dto';
import { ValidateObjectIdPipe } from 'pipes/ObjectId.validation.pipe';
import { InviteUserDTO } from './dto/invite-user.dto';
import { OrganizationMemberGuard } from './guards/organization-member.guard';

@Controller('organization')
@UseGuards(RolesGuard)
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createOrganizationSchema))
  @Roles('admin')
  async createOrganization(
    @Body() createOrganizationDTO: CreateOrganizationDTO,
  ) {
    try {
      const organizationId = await this.organizationService.createOrganization(
        createOrganizationDTO,
      );
      return {
        organization_id: organizationId,
      };
    } catch (error) {
      throw error;
    }
  }
  @Post(':organization_id/invite')
  @Roles('admin')
  @HttpCode(200)
  async inviteUser(
    @Body() inviteUserDTO: InviteUserDTO,
    @Param('organization_id', ValidateObjectIdPipe) organization_id: string,
  ) {
    try {
      const { user_email } = inviteUserDTO;
      await this.organizationService.inviteUser(user_email, organization_id);
      return {
        message: 'User Invited',
      };
    } catch (error) {
      throw error;
    }
  }
  @Put(':organization_id')
  @Roles('admin')
  async updateOrganization(
    @Body() newFields: UpdateOrganizationDTO,
    @Param('organization_id', ValidateObjectIdPipe) organization_id: string,
  ) {
    try {
      const updatedOrganization =
        await this.organizationService.updateOrganization(
          organization_id,
          newFields,
        );
      return {
        organization_id: updatedOrganization._id,
        name: updatedOrganization.name,
        description: updatedOrganization.description,
      };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':organization_id')
  @Roles('admin')
  async deleteOrganization(
    @Param('organization_id', ValidateObjectIdPipe) organization_id: string,
  ) {
    try {
      await this.organizationService.deleteOrganization(organization_id);

      return {
        message: 'Organization Deleted Successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('')
  @Roles('admin')
  async getAllOrganizations() {
    try {
      return await this.organizationService.getAllOrganizations();
    } catch (error) {
      throw error;
    }
  }
  @Get(':organization_id')
  @UseGuards(OrganizationMemberGuard)
  async getOrganizationById(@Param('organization_id') organization_id: string) {
    try {
      return await this.organizationService.getOrganizationById(
        organization_id,
      );
    } catch (error) {
      throw error;
    }
  }
}
