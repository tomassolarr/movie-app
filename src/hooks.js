import { useState, useEffect, useCallback } from "react"

export function useMovies(movieType, page = 1) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

const API_KEY = '0f6ece38caf04e94b997acd6df33cbd6'

  const loadMovies = useCallback(() => {
    setLoading(true)

    fetch(`https://api.themoviedb.org/3/movie/${movieType}?api_key=${API_KEY}&language=es-CL&page=${page}`)
      .then(response => response.json())
      .then((data) => {
        const newMovies = data.results.map(movie => {
          return {
            ...movie,
            poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }
        })
        
        if (page === 1) {
          setMovies(newMovies)
        } else {
          setMovies(prev => [...prev, ...newMovies])
        }
        
        setHasMore(data.page < data.total_pages && data.page < 5)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [movieType, page])

  useEffect(() => {
    console.log('Me llamo solo una vez')
    loadMovies()
  }, [loadMovies])

  return { movies, loading, hasMore }
}
