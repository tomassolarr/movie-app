import { Grid, Container, Typography, Box, Select, MenuItem, FormControl, InputLabel, CircularProgress, Button } from '@mui/material'
import Movie from './movies.jsx'
import MovieSkeleton from './MovieSkeleton.jsx'
import MovieModal from './MovieModal.jsx'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useMovies } from './hooks.js'
import SearchAppBar from './Header.jsx'
import FavoriteIcon from '@mui/icons-material/Favorite';

function Header() {
  return (
    <Box sx={{ textAlign: 'center', py: 3, px: 2 }}>
      <Typography 
        variant="h3" 
        component="h1"
        sx={{ 
          fontWeight: 800,
          background: 'linear-gradient(135deg, #1976d2 0%, #7c4dff 50%, #ff4081 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          mb: 1,
          fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
        }}
      >
        Cartelera Comunidad Castillo
      </Typography>
      <Typography 
        variant="h5" 
        sx={{ 
          color: '#ff4081',
          fontWeight: 600,
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
        }}
      >
        Octubre 2025
      </Typography>
    </Box>
  )
}

export default function App() {
  const [searchText, setSearchText] = useState('')
  const [movieType, setMovieType] = useState('upcoming')
  const [sortBy, setSortBy] = useState('default')
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [showFavorites, setShowFavorites] = useState(false)
  const observerRef = useRef()

  const { movies, loading, hasMore } = useMovies(movieType, page)

  useEffect(() => {
    console.log('Me llamo siempre') 
  })

  useEffect(() => {
    console.log('Me llamo cuando searchText cambia de valor:', searchText)
  }, [searchText])

  useEffect(() => {
    setPage(1)
  }, [movieType])

  const handleInputChange = (event) => {
    setSearchText(event.target.value)
  }

  const handleSelectChange = (event) => {
    console.log(event.target.value)
    setMovieType(event.target.value)
    setPage(1)
  }

  const getFavoriteMovies = () => {
    const favorites = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('movie_') && key.endsWith('_favorite')) {
        const movieId = key.replace('movie_', '').replace('_favorite', '')
        if (localStorage.getItem(key) === 'true') {
          const movie = movies.find(m => m.id === parseInt(movieId))
          if (movie) {
            favorites.push(movie)
          }
        }
      }
    }
    return favorites
  }

  const filterMovie = (movie) => {
    if (showFavorites) {
      const isFavorite = localStorage.getItem(`movie_${movie.id}_favorite`) === 'true'
      if (!isFavorite) return false
    }

    if (searchText.length > 0) {
      if (!movie.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) {
        return false
      }
    }
    return true
  }

  const sortMovies = (movieList) => {
    const sorted = [...movieList]
    switch (sortBy) {
      case 'rating_desc':
        return sorted.sort((a, b) => b.vote_average - a.vote_average)
      case 'rating_asc':
        return sorted.sort((a, b) => a.vote_average - b.vote_average)
      case 'date_desc':
        return sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
      case 'date_asc':
        return sorted.sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
      default:
        return sorted
    }
  }

  const handleShare = ({ name }) => {
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Mira "${name}" en Cartelera Comunidad Castillo`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(`Mira "${name}" - ${window.location.href}`)
      alert('Enlace copiado al portapapeles')
    }
  }

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedMovie(null)
  }

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites)
    setPage(1)
  }

  const lastMovieElementRef = useCallback(node => {
    if (loading) return
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && page < 5 && !showFavorites) {
        setPage(prevPage => prevPage + 1)
      }
    })
    
    if (node) observerRef.current.observe(node)
  }, [loading, hasMore, page, showFavorites])

  const displayMovies = showFavorites ? getFavoriteMovies() : movies
  const filteredAndSortedMovies = sortMovies(displayMovies.filter(filterMovie))
  const skeletonCount = 8

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: '#f5f7fa',
      pb: 6,
    }}>
      <SearchAppBar
        value={searchText}
        onChange={handleInputChange}
      />
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2, 
          mb: 4,
          mt: 3,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Categoría</InputLabel>
            <Select
              value={movieType}
              label="Categoría"
              onChange={handleSelectChange}
              sx={{ minWidth: 180 }}
              disabled={showFavorites}
            >
              <MenuItem value="upcoming">Próximas películas</MenuItem>
              <MenuItem value="now_playing">En cartelera</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={sortBy}
              label="Ordenar por"
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="default">Por defecto</MenuItem>
              <MenuItem value="rating_desc">Mayor rating</MenuItem>
              <MenuItem value="rating_asc">Menor rating</MenuItem>
              <MenuItem value="date_desc">Más recientes</MenuItem>
              <MenuItem value="date_asc">Más antiguas</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant={showFavorites ? "contained" : "outlined"}
            color="error"
            startIcon={<FavoriteIcon />}
            onClick={toggleFavorites}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              minWidth: 150,
            }}
          >
            {showFavorites ? 'Ver todas' : 'Mis favoritos'}
          </Button>
        </Box>
        
        <Header />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {loading && page === 1 && !showFavorites
            ? Array.from({ length: skeletonCount }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
                  <MovieSkeleton index={index} />
                </Grid>
              ))
            : filteredAndSortedMovies.map((movie, index) => {
                const isLast = filteredAndSortedMovies.length === index + 1
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`${movie.id}-${index}`} ref={isLast && hasMore && page < 5 && !showFavorites ? lastMovieElementRef : null}>
                    <Movie
                      id={movie.id}
                      name={movie.title}
                      description={movie.overview}
                      image={movie.poster_path}
                      rating={movie.vote_average}
                      releaseDate={movie.release_date}
                      onShare={handleShare}
                      onClick={() => handleMovieClick(movie)}
                      index={index}
                    />
                  </Grid>
                )
              })
          }
        </Grid>

        {loading && page > 1 && !showFavorites && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && filteredAndSortedMovies.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {showFavorites ? 'No tienes películas favoritas' : 'No se encontraron películas'}
            </Typography>
          </Box>
        )}

        {!showFavorites && !hasMore && displayMovies.length > 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No hay más películas para mostrar
            </Typography>
          </Box>
        )}
      </Container>

      <MovieModal
        movie={selectedMovie}
        open={modalOpen}
        onClose={handleCloseModal}
        onShare={handleShare}
      />
    </Box>
  )
}
