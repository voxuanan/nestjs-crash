import { registerAs } from '@nestjs/config';
import { PHONE_NUMBER_COUNTRY_CODE_ALLOWED } from 'src/app/constants/app.phone-number-country-code-allowed';

export default registerAs(
    'user',
    (): Record<string, any> => ({
        uploadPath: '/user',
        mobileNumberCountryCodeAllowed: PHONE_NUMBER_COUNTRY_CODE_ALLOWED,
    }),
);
