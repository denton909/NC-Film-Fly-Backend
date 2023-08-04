const users = () => {
    return [{
            name: 'charlie',
            username: 'charlie123',
            email_address: 'charlie123@outlook.com',
            password: 'password123',
            genre_scores: {
                "Action": 100,
                "Adventure": 50,
                "Fantasy": 50,
                "Science Fiction": 50,
                "Crime": 50,
                "Drama": 50,
                "Thriller": 50,
                "Animation": 50,
                "Family": 50,
                "Western": 50,
                "Romance": 50,
                "Comedy": 75,
                "Horror": 75,
                "Mystery": 50,
                "History": 50,
                "War": 50,
                "Music": 50,
                "Documentary": 50,
                "Foreign": 50,
                "TV Movie": 50,
            },
            genre_pref: {
                pref: ['action', 'comedy', 'horror']
            },
            actor_pref: {
                pref: ['Brad Pitt', 'Idris Elba', 'Tom Hanks']
            },
            actor_scores: {
                'Brad Pitt': 75,
                'Idris Elba': 75,
                'Tom Hanks': 75
            },
            director_pref: {
                pref: ['Christopher Nolan']
            },
            director_scores: {
                'Christopher Nolan': 75
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
        },
        {
            name: 'phil',
            username: 'phil1234',
            email_address: 'phil1234@outlook.com',
            password: 'password1234',
            genre_scores: {
                'action': 5,
                'thriller': 5,
                'crime': 5
            },
            genre_pref: {
                pref: ['action', 'thriller', 'crime']
            },
            actor_pref: {
                pref: ['Brad Pitt', 'Idris Elba', 'Denzel Washington']
            },
            actor_scores: {
                'Brad Pitt': 5,
                'Idris Elba': 5,
                'Denzel Washington': 5
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
    ]
}

module.exports = users