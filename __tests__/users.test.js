const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const { agent } = require('superagent');

describe('Petreon routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('adds a user', async() => {
    return request(app)
      .post('/api/v1/users')
      .send({
        userName: 'KittenMittens',
        firstName: 'Jane',
        lastName: 'Doe',
        profilePicture: 'face.jpg',
        profileDescription: 'i like kittens in mittens'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          userName: 'KittenMittens',
          firstName: 'Jane',
          lastName: 'Doe',
          creationDate: expect.any(String),
          profilePicture: 'face.jpg',
          profileDescription: 'i like kittens in mittens',
          likes: "0"
        });
      });
  });

  it('returns all users', async() => {
    await pool.query(fs.readFileSync('./__tests__/usersTest.sql', 'utf-8'));
    const agent = request.agent(app);
    const users = await User
      .find();

    const res = await agent
      .get('/api/v1/users')

    expect(res.body).toEqual(users);
  });

  it('returns a user by id', async() => {
    await pool.query(fs.readFileSync('./__tests__/usersTest.sql', 'utf-8'));
    const agent = request.agent(app);

    const res = await agent
      .get('/api/v1/users/2')

    expect(res.body).toEqual({
      id: expect.any(String),
      userName: 'dogbone',
      firstName: 'wishbone',
      lastName: 'archer',
      creationDate: expect.any(String),
      profilePicture: 'dog.jpg',
      profileDescription: 'stuffstuffstuff',
      likes: '0',
      pets: []
    })
  })
});
