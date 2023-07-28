const db = require('./connection')
const request = require('supertest')
const seed = require('./seed')
const app = require('./app')

beforeAll(() => {
    return seed()
  });
  
  afterAll(() => {
    db.end()
  });


describe('Get : Users', () => {
    test('Returns Correct Objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
          
            body.forEach((obj) => {
                expect(obj).toHaveProperty("username", expect.any(String));
                expect(obj).toHaveProperty("genre_scores", expect.any(String));
                expect(obj).toHaveProperty("user_id", expect.any(Number));
                expect(obj).toHaveProperty("genre_pref", expect.any(String)); 
                expect(obj).toHaveProperty("actor_pref", expect.any(String));
                expect(obj).toHaveProperty("actor_scores", expect.any(String)); 
                expect(obj).toHaveProperty("director_pref", expect.any(String));
                expect(obj).toHaveProperty("director_scores", expect.any(String)); 
                expect(obj).toHaveProperty("liked_movies", expect.any(String));
                expect(obj).toHaveProperty("disliked_movies", expect.any(String)); 
                expect(obj).toHaveProperty("watched_recently", expect.any(String));
              });
        })
    })
})
describe('Get : User', () => {
    test('Returns Correct Object', () => {
        return request(app)
        .get('/api/users/1')
        .expect(200)
        .then(({body}) => {
                expect(body).toHaveProperty("username", ('charlie'));
                expect(body).toHaveProperty("genre_scores", expect.any(String));
                expect(body).toHaveProperty("user_id", expect.any(Number));
                expect(body).toHaveProperty("genre_pref", expect.any(String)); 
                expect(body).toHaveProperty("actor_pref", expect.any(String));
                expect(body).toHaveProperty("actor_scores", expect.any(String)); 
                expect(body).toHaveProperty("director_pref", expect.any(String));
                expect(body).toHaveProperty("director_scores", expect.any(String)); 
                expect(body).toHaveProperty("liked_movies", expect.any(String));
                expect(body).toHaveProperty("disliked_movies", expect.any(String)); 
                expect(body).toHaveProperty("watched_recently", expect.any(String));
        })
    })
    test('400: Incorrect url parameter input outputs a useful error message', () => {
        return request(app)
        .get("/api/users/dog")
        .expect(404)
        .then((body) => {

          expect(body.error.text).toEqual('Error: 404 - Not Found')
        })
      })
      test('404: valid ID that doesnt exist outputs useful error message', () => {
        return request(app)
        .get("/api/users/1000")
        .expect(404)
        .then((body) => {

          expect(body.error.text).toEqual('Error: 404 - Not Found')
        })
      })
})


describe('Get : Movies', () => {
    test('Returns Correct Objects', () => {
        return request(app)
        .get('/api/movies')
        .expect(200)
        .then(({body}) => {

            body.forEach((obj) => {
                expect(obj).toHaveProperty("budget");
                expect(obj).toHaveProperty("genres");
                expect(obj).toHaveProperty("homepage");
                expect(obj).toHaveProperty("keywords"); 
                expect(obj).toHaveProperty("original_language");
                expect(obj).toHaveProperty("original_title"); 
                expect(obj).toHaveProperty("overview");
                expect(obj).toHaveProperty("popularity"); 
                expect(obj).toHaveProperty("production_companies");
                expect(obj).toHaveProperty("production_countries"); 
                expect(obj).toHaveProperty("release_date");
                expect(obj).toHaveProperty("revenue");
                expect(obj).toHaveProperty("runtime");
                expect(obj).toHaveProperty("spoken_languages");
                expect(obj).toHaveProperty("status");
                expect(obj).toHaveProperty("tagline");
                expect(obj).toHaveProperty("title");
                expect(obj).toHaveProperty("vote_average");
                expect(obj).toHaveProperty("vote_count");
              });
        })
    })
})

describe('Get : Recs', () => {
    test('Returns Correct Object', () => {
        return request(app)
        .get('/api/users/1/recommendations')
        .expect(200)
        .then(({body}) => {
                expect(body).toHaveProperty("username", ('charlie'));
                expect(body).toHaveProperty("genre_scores", expect.any(String));
                expect(body).toHaveProperty("user_id", expect.any(Number));
                expect(body).toHaveProperty("genre_pref", expect.any(String)); 
                expect(body).toHaveProperty("actor_pref", expect.any(String));
                expect(body).toHaveProperty("actor_scores", expect.any(String)); 
                expect(body).toHaveProperty("director_pref", expect.any(String));
                expect(body).toHaveProperty("director_scores", expect.any(String)); 
                expect(body).toHaveProperty("liked_movies", expect.any(String));
                expect(body).toHaveProperty("disliked_movies", expect.any(String)); 
                expect(body).toHaveProperty("watched_recently", expect.any(String));
        })
    })
    // test('400: Incorrect url parameter input outputs a useful error message', () => {
    //     return request(app)
    //     .get("/api/users/1/recommendations")
    //     .expect(404)
    //     .then((body) => {

    //       expect(body.error.text).toEqual('Error: 404 - Not Found')
    //     })
    //   })
    //   test('404: valid ID that doesnt exist outputs useful error message', () => {
    //     return request(app)
    //     .get("/api/users/1000")
    //     .expect(404)
    //     .then((body) => {

    //       expect(body.error.text).toEqual('Error: 404 - Not Found')
    //     })
    //   })
})