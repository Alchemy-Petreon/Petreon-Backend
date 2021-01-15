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

  it('creates a pet', async () => {
    const lassie = await User
      .insert({
        userName: 'lassie',
        firstName: 'dave',
        email: 'whatev',
        profilePicture: 'hiho.jpg',
        profileDescription: 'i like dogs'
      })

    return request(app)
      .post('/api/v1/pets')
      .send({
        userId: `${lassie.id}`,
        petName: 'dingo',
        type: 'dog',
        petProfilePicture: 'dingo.jpg',
        petProfileDescription: 'dingo ate a baby',
        bannerPicture: 'dingo2.jpg'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          userId: '1',
          petName: 'dingo',
          accountCreated: expect.any(String),
          type: 'dog',
          petProfilePicture: 'dingo.jpg',
          petProfileDescription: 'dingo ate a baby',
          bannerPicture: 'dingo2.jpg'
        })
      });
  });

  it('returns all pets', async () => {
    await pool.query(fs.readFileSync('./__tests__/petsTest.sql', 'utf-8'));
    const agent = request.agent(app);
    const pets = await Pet
      .find();

    const res = await agent
      .get('/api/v1/pets')

    expect(res.body).toEqual(pets)
  })

  it('returns a pet by id', async () => {
    await pool.query(fs.readFileSync('./__tests__/petsTest.sql', 'utf-8'));
    const agent = request.agent(app);

    const res = await agent
      .get('/api/v1/pets/1')

    expect(res.body).toEqual({
      id: expect.any(String),
      userId: '1',
      petName: 'gilgamesh',
      type: 'cat',
      accountCreated: expect.any(String),
      petProfilePicture: 'gil.jpg',
      petProfileDescription: 'demon cat',
      bannerPicture: 'gil2.jpg',
      posts: []
    });
  });

  it('updates a pet by id', async () => {
    const agent = request.agent(app);

    const lassie = await User
      .insert({
        userName: 'lassie',
        firstName: 'dave',
        email: 'whatev',
        profilePicture: 'hiho.jpg',
        profileDescription: 'i like dogs'
      })

    const ed = await Pet
      .create({
        userId: `${lassie.id}`,
        petName: 'edward',
        type: 'bird',
        petProfilePicture: 'birb.png',
        petProfileDescription: 'i am iron birb',
        bannerPicture: 'birb2.png'
      })

    const res = await agent
      .put(`/api/v1/pets/${ed.id}`)
      .send({
        petName: 'edward',
        petProfilePicture: 'bird.png',
        petProfileDescription: 'i am iron bird',
        bannerPicture: 'bird2.png'
      })

    expect(res.body).toEqual({
      id: expect.any(String),
      userId: expect.any(String),
      petName: 'edward',
      type: 'bird',
      accountCreated: expect.any(String), petProfilePicture: 'bird.png',
      petProfileDescription: 'i am iron bird',
      bannerPicture: 'bird2.png'
    });
  });

  it('deletes a pet', async () => {
    const agent = request.agent(app);

    const lassie = await User
      .insert({
        userName: 'lassie',
        firstName: 'dave',
        email: 'whatev',
        profilePicture: 'hiho.jpg',
        profileDescription: 'i like dogs'
      })

    const ed = await Pet
      .create({
        userId: `${lassie.id}`,
        petName: 'edward',
        type: 'bird',
        petProfilePicture: 'birb.png',
        petProfileDescription: 'i am iron birb',
        bannerPicture: 'birb2.png'
      })

    return await agent
      .delete(`/api/v1/pets/${ed.id}`)

      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          userId: expect.any(String),
          petName: 'edward',
          type: 'bird',
          accountCreated: expect.any(String),
          petProfilePicture: 'birb.png',
          petProfileDescription: 'i am iron birb',
          bannerPicture: 'birb2.png'
        });
      });
  });
});
