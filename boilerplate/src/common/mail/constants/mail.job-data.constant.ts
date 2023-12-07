import { UserEntity } from 'src/modules/user/entities/user.entity';

export class mailForgotPasswordContext {
    user: UserEntity;
    redirectURL: string;
}

export class mailForgotPasswordJobData {
    email: string;
    context: mailForgotPasswordContext;
}

export class mailSavedSearchContext {
    listingIds: string[];
    value: number;
    searchName: string;
}

export class mailSavedSearchJobData {
    email: string;
    context: mailSavedSearchContext;
}
