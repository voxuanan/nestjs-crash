import { InternalServerErrorException } from '@nestjs/common';

export const errorsToTrackInSentry = [
    InternalServerErrorException,
    TypeError,
    SyntaxError,
];
