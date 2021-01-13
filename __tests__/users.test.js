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

  it('updates a user', async() => {
    const agent = request.agent(app);

    const lassie = await User
      .insert({
        userName: 'lassie',
        firstName: 'dave',
        lastName: 'whatev',
        profilePicture: 'hiho.jpg',
        profileDescription: 'i like dogs'
      })

    const res = await agent
      .put(`/api/v1/users/${lassie.id}`)
      .send({
        userName: 'lassie',
        firstName: 'dave',
        lastName: 'whatev',
        profilePicture: 'hiho.jpg',
        profileDescription: 'i LOVE dogs'
      })

    expect(res.body).toEqual({
      id: expect.any(String),
      userName: 'lassie',
      firstName: 'dave',
      lastName: 'whatev',
      creationDate: expect.any(String),
      profilePicture: 'hiho.jpg',
      profileDescription: 'i LOVE dogs',
      likes: '0'
    });
  });

  it('deletes a user', async() => {
    const agent = request.agent(app);

    const lassie = await User
      .insert({
        userName: 'lassie',
        firstName: 'dave',
        lastName: 'whatev',
        profilePicture: 'hiho.jpg',
        profileDescription: 'i like dogs'
      })

    return await agent
      .delete(`/api/v1/users/${lassie.id}`)

      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          userName: 'lassie',
          firstName: 'dave',
          lastName: 'whatev',
          creationDate: expect.any(String),
          profilePicture: 'hiho.jpg',
          profileDescription: 'i like dogs',
          likes: '0'
        })
      })
  })

});

