const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Pet = require('../lib/models/Pet')
const { agent } = require('superagent');

describe('Petreon routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a post', async() => {
    const lassie = await User
    .insert({
      userName: 'lassie',
      firstName: 'dave',
      lastName: 'whatev',
      profilePicture: 'hiho.jpg',
      profileDescription: 'i like dogs'
  });

  const dingo = await Pet
    .create({
        userId: `${lassie.id}`,
        petName: 'dingo',
        type: 'dog',
        petProfilePicture: 'dingo.jpg',
        petProfileDescription: 'dingo ate a baby',
        bannerPicture: 'dingo2.jpg'
    });

    return request(app)
      .post('/api/v1/posts')
      .send({
          petId: `${dingo.id}`,
          pictureUrl: 'dingosocute.jpg',
          postText: 'dingo so cute',
      })
      .then(res => {
          expect(res.body).toEqual({
              id: expect.any(String),
              petId: '1',
              postTime: expect.any(String),
              pictureUrl: 'dingosocute.jpg',
              videoUrl: null,
              postText: 'dingo so cute',
              likes: '0'
          });
      });
  })

});