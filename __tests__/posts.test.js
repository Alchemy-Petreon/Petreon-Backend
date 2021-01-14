const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Pet = require('../lib/models/Pet');
const Post = require('../lib/models/Post')
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
          postText: 'dingo so cute'
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

  it('returns all posts', async() => {
    await pool.query(fs.readFileSync('./__tests__/postsTest.sql', 'utf-8'));
    const agent = request.agent(app);
    const posts = await Post
        .find();

    const res = await agent
        .get('/api/v1/posts')

    expect(res.body).toEqual(posts)
  });

  it('returns a post by id', async() => {
    await pool.query(fs.readFileSync('./__tests__/postsTest.sql', 'utf-8'));
    const agent = request.agent(app);
    const res = await agent
        .get('/api/v1/posts/2')

    expect(res.body).toEqual({
        id: expect.any(String),
        petId: '2',
        postTime: expect.any(String),
        pictureUrl: null,
        videoUrl: 'mumubad.avi',
        postText: 'mumu so bad',
        likes: '0',
        comments: []
    });
  });

  it('updates a post', async() => {
    const agent = request.agent(app);

    const lassie = await User
    .insert({
      userName: 'lassie',
      firstName: 'dave',
      lastName: 'whatev',
      profilePicture: 'hiho.jpg',
      profileDescription: 'i like dogs'
    });

    const ed = await Pet
    .create({
      userId: `${lassie.id}`,
      petName: 'edward',
      type: 'bird',
      petProfilePicture: 'bird.png',
      petProfileDescription: 'i am iron bird',
      bannerPicture: 'bird2.png'
    });

    const edpic = await Post
    .insert({
        petId: `${ed.id}`,
        pictureUrl: 'dingosocute.jpg',
        postText: 'dingo so cute'
    });

    const res = await agent
      .put(`/api/v1/posts/1`)
      .send({
          pictureUrl: 'edsocute.jpg',
          postText: 'ed so cute'
      });

    expect(res.body).toEqual({
        id: expect.any(String),
        petId: expect.any(String),
        postTime: expect.any(String),
        pictureUrl: 'edsocute.jpg',
        videoUrl: null,
        postText: 'ed so cute',
        likes: '0'
    });
  });

  it('deletes a post', async() => {
    const agent = request.agent(app);

    const lassie = await User
    .insert({
      userName: 'lassie',
      firstName: 'dave',
      lastName: 'whatev',
      profilePicture: 'hiho.jpg',
      profileDescription: 'i like dogs'
    });

    const ed = await Pet
    .create({
      userId: `${lassie.id}`,
      petName: 'edward',
      type: 'bird',
      petProfilePicture: 'bird.png',
      petProfileDescription: 'i am iron bird',
      bannerPicture: 'bird2.png'
    });

    await Post
    .insert({
        petId: `${ed.id}`,
        pictureUrl: 'edsocute.jpg',
        postText: 'ed so cute'
    });

    return await agent
      .delete(`/api/v1/posts/1`)

      .then(res => {
          expect(res.body).toEqual({
            id: expect.any(String),
            petId: expect.any(String),
            postTime: expect.any(String),
            pictureUrl: 'edsocute.jpg',
            videoUrl: null,
            postText: 'ed so cute',
            likes: '0'
          })
      })
  })

});