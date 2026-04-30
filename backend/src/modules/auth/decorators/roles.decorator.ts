import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../guards/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
