import React from 'react'

const MovieList = (props) => {
    const FavoriteComponent = props.favoriteComponent

	return (
		<>
			{ props.movies.map((movie, index) => (
				<div className='image-container d-flex m-3' key={ index }>
					<img src={ movie.Poster } alt='movie'></img>
                    <div className='overlay d-flex justify-content-center'
                        onClick={() => props.handleFavoritesClick(movie)}>
                        <FavoriteComponent/>
					</div>
				</div>
			))}
		</>
	)
}

export default MovieList