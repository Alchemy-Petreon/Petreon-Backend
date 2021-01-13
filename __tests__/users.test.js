const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');

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
  
});
