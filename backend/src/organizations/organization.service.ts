import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationDocument,
} from './schemas/organization.schema';
import { Model } from 'mongoose';
import { CreateOrganizationDTO } from './dto/create-organization.dto';
import { UpdateOrganizationDTO } from './dto/update-organization.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    private userService: UsersService,
  ) {}

  async createOrganization(createOrganizationDTO: CreateOrganizationDTO) {
    try {
      const organization = await this.organizationModel.create(
        createOrganizationDTO,
      );
      return organization._id;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(
          'Validation failed for organization data.',
        );
      }

      if (error.code === 11000) {
        throw new ConflictException('Organization already exists.');
      }

      throw new InternalServerErrorException('An internal error occurred.');
    }
  }

  async getAllOrganizations() {
    try {
      const organization = await this.organizationModel
        .find()
        .populate('organization_members', 'name email role')
        .exec();
      return organization;
    } catch (error) {
      throw error;
    }
  }
  async getOrganizationById(organization_id: string) {
    try {
      const organization = await this.organizationModel
        .findById(organization_id)
        .populate('organization_members', 'name email role');

      return organization;
    } catch (error) {
      throw error;
    }
  }

  async updateOrganization(
    organization_id: string,
    newFields: UpdateOrganizationDTO,
  ) {
    try {
      const updatedOrganization = await this.organizationModel
        .findByIdAndUpdate(organization_id, newFields, { new: true })
        .select('_id name description');

      if (!updatedOrganization) {
        throw new NotFoundException('Organization not found');
      }
      return updatedOrganization;
    } catch (error) {
      throw error;
    }
  }

  async deleteOrganization(organization_id: string) {
    try {
      const result =
        await this.organizationModel.findByIdAndDelete(organization_id);
      if (!result) {
        throw new NotFoundException('Organization not found!');
      }
    } catch (error) {
      throw error;
    }
  }

  async inviteUser(user_email: string, organization_id: string) {
    try {
      const userExists = await this.userService.getUserByEmail(user_email);
      if (!userExists) {
        throw new NotFoundException('User does not exist');
      }
      const result = await this.organizationModel.findByIdAndUpdate(
        organization_id,
        {
          $addToSet: { organization_members: userExists._id },
        },
      );
      if (!result) {
        throw new NotFoundException('Organization not found');
      }
    } catch (error) {
      throw error;
    }
  }
}
