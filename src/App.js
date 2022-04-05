import React, { useReducer, useEffect } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.scss'

import Search from './components/Search'
import MovieList from './components/MovieList'
import AddToFavorites from './components/AddToFavorites'
import MovieListHeading from './components/MovieListHeading'
import RemoveFavorites from './components/RemoveFavorites'

const MOVIE_API_URL = 'https://www.omdbapi.com/?s=batman&apikey=4a3b711b'

const initialState = {
    loading: true,
    movies: [],
    errorMessage: null,
    favoriteMovies: []
}


const reducer = (state, action) => {
    switch (action.type) {
        case 'SEARCH_MOVIES_REQUEST':
        return {
            ...state,
            loading: true,
            errorMessage: null
        }
        case 'SEARCH_MOVIES_SUCCESS':
        return {
            ...state,
            loading: false,
            movies: action.payload
        }
        case 'SEARCH_MOVIES_FAILURE':
        return {
            ...state,
            loading: false,
            errorMessage: action.error
        }
        case 'SET_FAVORITE_MOVIES':
        return {
            ...state,
            favoriteMovies: action.payload
        }
        default:
        return state
    }
}

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const { movies, errorMessage, loading, favoriteMovies } = state

    useEffect(() => {
    
        fetch(MOVIE_API_URL)
            .then(response => response.json())
            .then(jsonResponse => {
        
            //getting movies to display on page load
            dispatch({
                type: 'SEARCH_MOVIES_SUCCESS',
                payload: jsonResponse.Search
            })
        })

        //getting favorite movies from local storage on page load
        const movieFavorites = JSON.parse(
            localStorage.getItem('react-movie-app-favorites')
        )

        if(movieFavorites && movieFavorites.length){
            dispatch({
                type: 'SET_FAVORITE_MOVIES',
                payload: movieFavorites
            })
        }

    }, []) // empty array means this effect will only run once. [loading] would run the effect every time loading changes

    //saving favorite movies on local storage
    const saveToLocalStorage = (items) => {
        localStorage.setItem('react-movie-app-favorites', JSON.stringify(items))
    }

    const search = searchValue => {
        dispatch({
            type: 'SEARCH_MOVIES_REQUEST'
        })
    
        fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b`)
        .then(response => response.json())
        .then(jsonResponse => {
            if (jsonResponse.Response === 'True') {
                dispatch({
                    type: 'SEARCH_MOVIES_SUCCESS',
                    payload: jsonResponse.Search
                })
            } else {
                dispatch({
                    type: 'SEARCH_MOVIES_FAILURE',
                    error: jsonResponse.Error
                })
            }
        })
    }

    const addFavoriteMovie = movie => {
        let movieAdded = favoriteMovies.find(movieObj => movieObj.imdbID === movie.imdbID)
        const newFavoriteMoviesList = movieAdded ? favoriteMovies : [...favoriteMovies, movie]
            dispatch({
                type: 'SET_FAVORITE_MOVIES',
                payload: newFavoriteMoviesList
            })

        saveToLocalStorage(newFavoriteMoviesList)
    }

    const removeFavoriteMovie = (movie) => {
        const newFavoriteMoviesList = favoriteMovies.filter(
            (favorite) => favorite.imdbID !== movie.imdbID
        )
    
        dispatch({
            type: 'SET_FAVORITE_MOVIES',
            payload: newFavoriteMoviesList
        })

        saveToLocalStorage(newFavoriteMoviesList)
    }

    return (
        <div className='container-fluid'>
            <div className='mt-4 mb-4'>
                <Search search={ search }/>
                <div className='mt-3'>
                    <MovieListHeading heading='Movies'/>
                </div>
            </div>
            
            <div className='row'>
                { loading && !errorMessage ? (
                    <span>loading... </span>
                ) : errorMessage ? (
                    <div>{ errorMessage }</div>
                ) : <MovieList movies={ movies } favoriteComponent={ AddToFavorites } handleFavoritesClick={ addFavoriteMovie }/> }
            </div>

            <div className='row d-flex mt-4 mb-4'>
                { favoriteMovies.length ? <MovieListHeading heading='Favorites' /> : ''}
            </div>
            <div className='row'>
                <MovieList movies={ favoriteMovies } favoriteComponent={ RemoveFavorites } handleFavoritesClick={ removeFavoriteMovie }/>
            </div>
        </div>
    )
}

export default App