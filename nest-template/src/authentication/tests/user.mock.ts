import User from '../../users/entity/user.entity';

const mockedUser: User = {
  id: 4,
  email: 'string@gmail.com',
  name: 'string',
  password: 'string',
  address: {
    id: 1,
    street: 'streetName',
    city: 'cityName',
    country: 'countryName',
  },
  isEmailConfirmed: false,
  posts: [],
  phoneNumber: '0123456789',
  isPhoneNumberConfirmed: false,
  isTwoFactorAuthenticationEnabled: false,
  stripeCustomerId: 'string',
};

export default mockedUser;
