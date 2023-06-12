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
  posts: [],
  files: [],
};

export default mockedUser;
