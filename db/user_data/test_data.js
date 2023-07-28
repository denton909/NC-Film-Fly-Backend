const users = () => {
    return [
        {
        username : 'charlie', 
        genre_scores : {'action' : 5, 'comedy' : 5, 'horror' : 5}, 
        genre_pref : { pref : ['action', 'comedy', 'horror']}, 
        actor_pref : { pref : ['Brad Pitt', 'Idris Elba']},  
        actor_scores : {'Brad Pitt' : 5, 'Idris Elba' : 5},  
        director_pref : { pref : ['Christopher Nolan']}, 
        director_scores : {'Christopher Nolan' : 5},
        liked_movies : {liked : []}, 
        disliked_movies : { disliked : []},
        watched_recently : { history : []}
    },
        {
            username : 'phil', 
            genre_scores : {'action' : 5, 'thriller' : 5, 'crime' : 5}, 
            genre_pref : { pref : ['action', 'thriller', 'crime']}, 
            actor_pref : { pref : ['Brad Pitt', 'Idris Elba', 'Denzel Washington']},  
            actor_scores : {'Brad Pitt' : 5, 'Idris Elba' : 5, 'Denzel Washington' : 5},  
            director_pref : { pref : ['Christopher Nolan']}, 
            director_scores : {'Christopher Nolan' : 5},
            liked_movies : {liked : []}, 
            disliked_movies : { disliked : []},
            watched_recently : { history : []}
    }
]
}

module.exports = users