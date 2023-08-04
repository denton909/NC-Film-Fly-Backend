const db = require('./connection')
const request = require('supertest')
const seed = require('./seed')
const app = require('./app')
const movie = require('./csv_files/movies.json')
const crew = require('./csv_files/crew.json')
const users = require('./user_data/test_data')



describe("all tests", () => {
  beforeAll(async () => {

    await seed()
  
  }, 20000);

  afterAll(() => {
    db.end()
  });




  describe('Get : Users', () => {
    test('Returns Correct Objects', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({
          body
        }) => {

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
        .then(({
          body
        }) => {
          expect(body).toHaveProperty("username", ('charlie123'));
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

  describe('Post : User', () => {
    test('Returns Correct Objects', () => {
      const testUser = {
        name: 'sam',
        username: 'sam123',
        email_address: 'sam123@outlook.com',
        password: '123password',

      }
      return request(app)
        .post('/api/users')
        .send(testUser)
        .expect(201)
        .then(({
          body
        }) => {

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

  describe('Patch : User', () => {
    test('Returns Correct Objects', () => {
      const testPref = {
        genre_scores: {
          'romance': 5,
          'comedy': 5,
          'horror': 5
        },
        genre_pref: {
          pref: ['romance', 'comedy', 'horror']
        },
        actor_pref: {
          pref: ['Brad Pitt', 'Idris Elba']
        },
        actor_scores: {
          'Brad Pitt': 5,
          'Idris Elba': 5
        },
        director_pref: {
          pref: ['Christopher Nolan']
        },
        director_scores: {
          'Christopher Nolan': 5
        },
        liked_movies: {
          liked: []
        },
        disliked_movies: {
          disliked: []
        },
        watched_recently: {
          history: []
        }
      }

      const loggedInUser = 'sam123'
      return request(app)
        .patch(`/api/users/${loggedInUser}`)
        .send(testPref)
        .expect(201)
        .then(({
          body
        }) => {

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
  test('gets created user profile and populates scores correctly', () => {
    const testPref = {
      genre_scores: {},
      genre_pref: {
        pref: ['romance', 'comedy', 'horror']
      },
      actor_pref: {
        pref: ['Brad Pitt', 'Idris Elba']
      },
      actor_scores: {},
      director_pref: {
        pref: ['Christopher Nolan']
      },
      director_scores: {},
      liked_movies: {
        liked: []
      },
      disliked_movies: {
        disliked: []
      },
      watched_recently: {
        history: []
      }
    }
    const loggedInUser = 'charlie123'
    return request(app)
      .patch(`/api/users/${loggedInUser}`)
      .send(testPref)
      .expect(201)
      .then(({
        body
      }) => {
        expect(body[0].genre_scores).toEqual({
          'romance': 75,
          'comedy': 75,
          'horror': 75
        })
        expect(body[0].actor_scores).toEqual({
          'Brad Pitt': 75,
          'Idris Elba': 75
        })
        expect(body[0].director_scores).toEqual({
          'Christopher Nolan': 75
        })
      })
  })

  describe('Get : Movies', () => {
    test('Returns Correct Objects', () => {
      return request(app)
        .get('/api/movies')
        .expect(200)
        .then(({
          body
        }) => {

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

  describe('Get : Genres', () => {
    test('Returns movie Genres', () => {
      return request(app)
        .get('/api/movies/genres')
        .expect(200)
        .then(({
          body
        }) => {
          expect(typeof body).toEqual('object')
        })
    })
  })

  describe('Get : Directors', () => {
    test('Returns movie Directors', () => {
      return request(app)
        .get('/api/movies/directors')
        .expect(200)
        .then(({
          body
        }) => {
          expect(typeof body).toEqual('object')
        })
    })
  })

  describe('Get : Actors', () => {
    test('Returns movie Actors', () => {
      return request(app)
        .get('/api/movies/actors')
        .expect(200)
        .then(({
          body
        }) => {
          expect(typeof body).toEqual('object')
        })
    })
  })

  describe('Get : Recs', () => {
    test('Returns Correct Object', () => {
      return request(app)
        .get('/api/users/1/recommendations')
        .expect(200)
        .then(({
          body
        }) => {
          expect(body).toHaveProperty("username", ('charlie123'));
          expect(body).toHaveProperty("genre_scores", expect.any(Object));
          expect(body).toHaveProperty("user_id", expect.any(Number));
          expect(body).toHaveProperty("genre_pref", expect.any(Object));
          expect(body).toHaveProperty("actor_pref", expect.any(Object));
          expect(body).toHaveProperty("actor_scores", expect.any(Object));
          expect(body).toHaveProperty("director_pref", expect.any(Object));
          expect(body).toHaveProperty("director_scores", expect.any(Object));
          expect(body).toHaveProperty("liked_movies", expect.any(Object));
          expect(body).toHaveProperty("disliked_movies", expect.any(Object));
          expect(body).toHaveProperty("watched_recently", expect.any(Object));
        })
    })
    test.only('Returns a movie with a liked genre type when fed in a user', () => {
      return request(app)
        .get('/api/users/1/recommendations')
        .expect(200)
        .then(({
          body
        }) => {
          console.log(body)
          expect(typeof body).toBe('object')
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

  describe('Get : EndPoints', () => {
    test('Returns api endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({
          body
        }) => {
          expect(typeof body).toEqual('object')
        })
    })
  })

  describe('Patch : Add watched movie', () => {
    test('Watched movie added to watched movies list', () => {
      const testPref = {
        movie: {
          name: "The Dark Knight Rises"
        }
      }

      const loggedInUser = 'charlie123'

      return request(app)
        .patch(`/api/users/${loggedInUser}/add-movie`)
        .send(testPref)
        .expect(201)
        .then(({
          body
        }) => {

          expect(body[0]).toHaveProperty('watched_recently.history[0]', testPref.movie.name)
        })
    })
  })

  describe('Test recs', () => {
    test('testing JSON queries', () => {
      return request(app)
        .get('/api/test')
        .expect(200)
        .then(({
          body
        }) => {
          expect(typeof body).toEqual('object')
        })
    })
  })
})