import { SetMetadata } from '@nestjs/common';
import { META_ROLES } from '../constants/index.constants';
import { ValidRoles } from '../interfaces';

export const RoleProtected = (...args: ValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};
