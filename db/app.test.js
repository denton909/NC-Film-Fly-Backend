const db = require('./connection')
const request = require('supertest')
const seed = require('./seed')
const app = require('./app')




describe("all tests", () => {
  beforeAll(async () => {

    await seed()

  }, 200000);

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
            expect(obj).toHaveProperty("genre_scores", expect.any(Object));
            expect(obj).toHaveProperty("user_id", expect.any(Number));
            expect(obj).toHaveProperty("genre_pref", expect.any(Object));
            expect(obj).toHaveProperty("actor_pref", expect.any(Object));
            expect(obj).toHaveProperty("actor_scores", expect.any(Object));
            expect(obj).toHaveProperty("director_pref", expect.any(Object));
            expect(obj).toHaveProperty("director_scores", expect.any(Object));
            expect(obj).toHaveProperty("liked_movies", expect.any(Object));
            expect(obj).toHaveProperty("disliked_movies", expect.any(Object));
            expect(obj).toHaveProperty("watched_recently", expect.any(Object));
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
          expect(body[0]).toHaveProperty("username", ('charlie123'));
          expect(body[0]).toHaveProperty("genre_scores", expect.any(Object));
          expect(body[0]).toHaveProperty("user_id", expect.any(Number));
          expect(body[0]).toHaveProperty("genre_pref", expect.any(Object));
          expect(body[0]).toHaveProperty("actor_pref", expect.any(Object));
          expect(body[0]).toHaveProperty("actor_scores", expect.any(Object));
          expect(body[0]).toHaveProperty("director_pref", expect.any(Object));
          expect(body[0]).toHaveProperty("director_scores", expect.any(Object));
          expect(body[0]).toHaveProperty("liked_movies", expect.any(Object));
          expect(body[0]).toHaveProperty("disliked_movies", expect.any(Object));
          expect(body[0]).toHaveProperty("watched_recently", expect.any(Object));
        })
    })
    test('400: Incorrect url parameter input outputs a useful error message', () => {
      return request(app)
        .get("/api/users/dog")
        .expect(400)
        .then((body) => {

          expect(body.error.text).toEqual('Error: 400 - Bad Request')
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

  // describe('Post : User with password check', () => {
  //   test('Returns Correct Object', () => {
  //     const testUser = {
  //       name: 'billy',
  //       username: 'billy1234',
  //       email_address: 'billy1234@outlook.com',
  //       password: 'password1234',
  //     }
  //     const loginDetails = {
  //       username: 'billy1234',
  //       password: 'password1234'
  //     }
  //       return request(app)
  //       .post('/api/users')
  //       .send(testUser)
  //       .expect(201)
  //       .then(({body})=> {
  //         body.forEach((obj) => {
  //           expect(obj).toHaveProperty("username", expect.any(String));
  //           expect(obj).toHaveProperty("genre_scores", expect.any(Object));
  //           expect(obj).toHaveProperty("user_id", expect.any(Number));
  //           expect(obj).toHaveProperty("genre_pref", expect.any(Object));
  //           expect(obj).toHaveProperty("actor_pref", expect.any(Object));
  //           expect(obj).toHaveProperty("actor_scores", expect.any(Object));
  //           expect(obj).toHaveProperty("director_pref", expect.any(Object));
  //           expect(obj).toHaveProperty("director_scores", expect.any(Object));
  //           expect(obj).toHaveProperty("liked_movies", expect.any(Object));
  //           expect(obj).toHaveProperty("disliked_movies", expect.any(Object));
  //           expect(obj).toHaveProperty("watched_recently", expect.any(Object));
  //         });
  //         return body
  //       })
  //       .then((body)=> {
  //        return request(app)
  //         .post('/api/users/login')
  //         .send(loginDetails)
  //         .expect(200)
  //       })
  //       .then(({
  //         body
  //       }) => {
  //         expect(body[0]).toHaveProperty("username", ('billy1234'));
  //         expect(body[0]).toHaveProperty("genre_scores", expect.any(Object));
  //         expect(body[0]).toHaveProperty("user_id", expect.any(Number));
  //         expect(body[0]).toHaveProperty("genre_pref", expect.any(Object));
  //         expect(body[0]).toHaveProperty("actor_pref", expect.any(Object));
  //         expect(body[0]).toHaveProperty("actor_scores", expect.any(Object));
  //         expect(body[0]).toHaveProperty("director_pref", expect.any(Object));
  //         expect(body[0]).toHaveProperty("director_scores", expect.any(Object));
  //         expect(body[0]).toHaveProperty("liked_movies", expect.any(Object));
  //         expect(body[0]).toHaveProperty("disliked_movies", expect.any(Object));
  //         expect(body[0]).toHaveProperty("watched_recently", expect.any(Object));
  //       })
  //   })
  //   test('Returns 401 password incorrect ', () => {
  //     const testUser = {
  //       name: 'billy',
  //       username: 'billy1234',
  //       email_address: 'billy1234@outlook.com',
  //       password: 'password1234',
  //     }
  //     const loginDetails = {
  //       username: 'billy1234',
  //       password: 'password'
  //     }
                
  //        return request(app)
  //         .post('/api/users/login')
  //         .send(loginDetails)
  //         .expect(401)
        
  //       .then((
  //         body
  //       ) => {
  //         expect(body.text).toEqual('Error: 401 - Unauthorized Password')
  //       })   
      
  //   })

  // })

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
            expect(obj).toHaveProperty("genre_scores", expect.any(Object));
            expect(obj).toHaveProperty("user_id", expect.any(Number));
            expect(obj).toHaveProperty("genre_pref", expect.any(Object));
            expect(obj).toHaveProperty("actor_pref", expect.any(Object));
            expect(obj).toHaveProperty("actor_scores", expect.any(Object));
            expect(obj).toHaveProperty("director_pref", expect.any(Object));
            expect(obj).toHaveProperty("director_scores", expect.any(Object));
            expect(obj).toHaveProperty("liked_movies", expect.any(Object));
            expect(obj).toHaveProperty("disliked_movies", expect.any(Object));
            expect(obj).toHaveProperty("watched_recently", expect.any(Object));
          });
        })
    })
    test('Returns 400 for duplicate user', () => {
      const testUser = {
        name: 'phil',
        username: 'phil1234',
        email_address: 'phil1234@outlook.com',
        password: '123password',

      }
      return request(app)
        .post('/api/users')
        .send(testUser)
        .expect(400)
        .then((
          body
        ) => {
          expect(body.text).toEqual('Error: 400 - Bad Request Username or email address is already used')
        })
    })
  })

  describe('Patch : User', () => {
    const testPref = {
      genres: ['Western', 'Comedy', 'Horror'],
      actors: ['Brad Pitt', 'Idris Elba'],
      directors: ['Christopher Nolan']
    }
    test('Returns Correct Objects', () => {

      const loggedInUser = 2
      return request(app)
        .patch(`/api/users/${loggedInUser}`)
        .send(testPref)
        .expect(201)
        .then(({
          body
        }) => {
          body.forEach((obj) => {
            expect(obj).toHaveProperty("username", expect.any(String));
            expect(obj).toHaveProperty("user_id", expect.any(Number));
            expect(obj).toHaveProperty("genre_pref", {
              pref: ['Western', 'Comedy', 'Horror']
            });
            expect(obj).toHaveProperty("actor_scores", expect.any(Object));
            expect(obj).toHaveProperty("actor_pref", {
              pref: ['Brad Pitt', 'Idris Elba']
            });
            expect(obj).toHaveProperty("director_scores", expect.any(Object));
            expect(obj).toHaveProperty("director_pref", {
              pref: ['Christopher Nolan']
            });
            expect(obj).toHaveProperty("liked_movies", expect.any(Object));
            expect(obj).toHaveProperty("disliked_movies", expect.any(Object));
            expect(obj).toHaveProperty("watched_recently", expect.any(Object));
          });
        })
    })
    test('400: Incorrect url parameter input outputs a useful error message', () => {
      return request(app)
        .patch("/api/users/dog")
        .send(testPref)
        .expect(400)
        .then((body) => {

          expect(body.error.text).toEqual('Error: 400 - Bad Request')
        })
    })
    test('404: valid ID that doesnt exist outputs useful error message', () => {
      return request(app)
        .patch("/api/users/1000")
        .send(testPref)
        .expect(404)
        .then((body) => {
          expect(body.error.text).toEqual('Error: 404 - Not Found')
        })
    })
    test('400: Bad Request - Invalid Input Body ', () => {
      const testPrefWrong = {
        genre: ['Western', 'Comedy', 'Horror'],
        actor: ['Brad Pitt', 'Idris Elba'],
        director: ['Christopher Nolan']
      }
      return request(app)
        .patch("/api/users/2")
        .send(testPrefWrong)
        .expect(400)
        .then((body) => {
          expect(body.error.text).toEqual('Error: 400 - Bad Request Invalid Input Body')
        })
    })

  })

  describe('Patch : User with querys history', () => {
    const testWatched = {
      watched_recently: "cars"
    }
    test('Returns Correct Objects', () => {

      const loggedInUser = 2
      return request(app)
        .patch(`/api/users/${loggedInUser}?update=watched_recently`)
        .send(testWatched)
        .expect(201)
        .then(({
          body
        }) => {
          body.forEach((obj) => {
            expect(obj).toHaveProperty("username", expect.any(String));
            expect(obj).toHaveProperty("user_id", expect.any(Number));
            expect(obj).toHaveProperty("genre_pref", expect.any(Object));
            expect(obj).toHaveProperty("actor_scores", expect.any(Object));
            expect(obj).toHaveProperty("actor_pref", expect.any(Object));
            expect(obj).toHaveProperty("director_scores", expect.any(Object));
            expect(obj).toHaveProperty("director_pref", expect.any(Object));
            expect(obj).toHaveProperty("liked_movies", expect.any(Object));
            expect(obj).toHaveProperty("disliked_movies", expect.any(Object));
            expect(obj).toHaveProperty("watched_recently", {
              history: ["cars"]
            });
          });
        })
    })

  })

  describe('Patch : User with querys likes and dislikes', () => {
    const testLikes = {
      liked: "The Dark Knight",
      disliked: "Cars"
    }
    test('Returns Correct Objects', () => {

      const loggedInUser = 2
      return request(app)
        .patch(`/api/users/${loggedInUser}?update=likes`)
        .send(testLikes)
        .expect(201)
        .then(({
          body
        }) => {
          body.forEach((obj) => {
            expect(obj).toHaveProperty("username", expect.any(String));
            expect(obj).toHaveProperty("user_id", expect.any(Number));
            expect(obj).toHaveProperty("genre_pref", expect.any(Object));
            expect(obj).toHaveProperty("actor_scores", expect.any(Object));
            expect(obj).toHaveProperty("actor_pref", expect.any(Object));
            expect(obj).toHaveProperty("director_scores", expect.any(Object));
            expect(obj).toHaveProperty("director_pref", expect.any(Object));
            expect(obj).toHaveProperty("liked_movies", {
              liked: ["The Dark Knight"]
            });
            expect(obj).toHaveProperty("disliked_movies", {
              disliked: ["Cars"]
            });
            expect(obj).toHaveProperty("watched_recently", expect.any(Object))
          });
        });
    })
  })

  describe('Patch : User with querys likes or disliked', () => {
    const testLikes = {
      liked: "Batman Begins",
      disliked: ""
    }
    test('Returns Correct Objects', () => {

      const loggedInUser = 2
      return request(app)
        .patch(`/api/users/${loggedInUser}?update=likes`)
        .send(testLikes)
        .expect(201)
        .then(({
          body
        }) => {
          
          body.forEach((obj) => {
            expect(obj).toHaveProperty("username", expect.any(String));
            expect(obj).toHaveProperty("user_id", expect.any(Number));
            expect(obj).toHaveProperty("genre_pref", expect.any(Object));
            expect(obj).toHaveProperty("actor_scores", expect.any(Object));
            expect(obj).toHaveProperty("actor_pref", expect.any(Object));
            expect(obj).toHaveProperty("director_scores", expect.any(Object));
            expect(obj).toHaveProperty("director_pref", expect.any(Object));
            expect(obj).toHaveProperty("liked_movies", {
              liked: ["The Dark Knight","Batman Begins"]
            });
            expect(obj).toHaveProperty("disliked_movies", {
              disliked: ["Cars"]
            });
            expect(obj).toHaveProperty("watched_recently", expect.any(Object))
          });
        });
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
    test('Returns 10 movies based on users preferences', () => {
      return request(app)
        .get('/api/users/1/recommendations')
        .expect(200)
        .then(({
          body
        }) => {
          expect(typeof body).toBe('object')
          expect(body.length).toBe(10)
        })
    })
    test('Returns movies for a user that does not have any preferences', () => {
      return request(app)
        .get('/api/users/2/recommendations')
        .expect(200)
        .then(({
          body
        }) => {
          expect(typeof body).toBe('object')
          expect(body.length).toBe(10)
        })
    })
    test.only('Should not return movies that have already been liked or disliked', () => {
      return request(app)
        .get('/api/users/1/recommendations')
        .expect(200)
        .then(({
          body
        }) => {
          for (let i = 0; i < 10; i++) {
            expect(body[i]).not.toMatch('Fury')
            expect(body[i]).not.toMatch('Captain Phillips')
          }
          
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

  describe('Delete : User', () => {

    test('Returns 204 after user is deleted', () => {

      const loggedInUser = 2
      return request(app)
        .delete(`/api/users/${loggedInUser}`)
        .expect(204)
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
})