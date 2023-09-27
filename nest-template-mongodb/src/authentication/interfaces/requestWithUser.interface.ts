import { Request } from 'express';
import { UserDocument } from '../../users/entity/user.schema';

interface RequestWithUser extends Request {
  user: UserDocument;
}

export default RequestWithUser;
