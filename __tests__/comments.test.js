const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const Pet = require('../lib/models/Pet');
const Post = require('../lib/models/Post')
const Comment = require('../lib/models/Comment')
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

  const dingopost = await Post
    .insert({
        petId: `${dingo.id}`,
        pictureUrl: 'dingosocute.jpg',
        postText: 'dingo so cute'
    });

  return request(app)
    .post('/api/v1/comments')
    .send({
        userId: `${lassie.id}`,
        postId: `${dingopost.id}`,
        text: 'omg so cute'
    })
    .then(res => {
        expect(res.body).toEqual({
            id: expect.any(String),
            userId: expect.any(String),
            postId: '1',
            text: 'omg so cute',
            timestamp: expect.any(String)
        });
    });
  });

  it('deletes a comment', async() => {
    const agent = request.agent(app)

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

  const dingopost = await Post
    .insert({
        petId: `${dingo.id}`,
        videoUrl: 'dingosocute.avi',
        postText: 'dingo so cute'
    });

  await Comment
    .insert ({
        userId: `${lassie.id}`,
        postId: `${dingopost.id}`,
        text: 'omg so cute'
    })

  return await agent
    .delete(`/api/v1/comments/1`)

    .then(res => {
        expect(res.body).toEqual({
            id: expect.any(String),
            userId: expect.any(String),
            postId: expect.any(String),
            text: 'omg so cute',
            timestamp: expect.any(String)
        });
    });
  });

});