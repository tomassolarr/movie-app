import { Dialog, DialogContent, DialogTitle, IconButton, Typography, Box, Chip, Button, Divider } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { useState, useEffect } from "react";

const CloseButton = ({ onClose }) => (
  <IconButton
    onClick={onClose}
    sx={{
      position: 'absolute',
      right: 16,
      top: 16,
      background: 'rgba(0,0,0,0.5)',
      color: 'white',
      '&:hover': {
        background: 'rgba(0,0,0,0.7)',
      },
    }}
  >
    <CloseIcon />
  </IconButton>
)

export default function MovieModal({ movie, open, onClose, onShare }) {
  const API_KEY = '0f6ece38caf04e94b997acd6df33cbd6'
  const [isFavorite, setIsFavorite] = useState(false)
  const [genres, setGenres] = useState([])

  useEffect(() => {
    if (movie?.id) {
      setIsFavorite(localStorage.getItem(`movie_${movie.id}_favorite`) === 'true')
      
      fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=es-CL`)
        .then(res => res.json())
        .then(data => {
          if (data.genres) {
            setGenres(data.genres.map(g => g.name))
          }
        })
        .catch(() => setGenres([]))
    }
  }, [movie])

  if (!movie) return null

  const handleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false)
      localStorage.removeItem(`movie_${movie.id}_favorite`)
    } else {
      setIsFavorite(true)
      localStorage.setItem(`movie_${movie.id}_favorite`, 'true')
    }
  }

  const handleShare = () => {
    onShare?.({ name: movie.title })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
          alt={movie.title}
          sx={{
            width: '100%',
            height: { xs: 200, md: 350 },
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
          }}
        />
        <CloseButton onClose={onClose} />
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: 24,
            right: 24,
            color: 'white',
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {movie.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            {movie.vote_average && (
              <Chip
                icon={<StarIcon sx={{ color: '#ffd700' }} />}
                label={movie.vote_average.toFixed(1)}
                sx={{
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            )}
            {movie.release_date && (
              <Chip
                icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                label={movie.release_date}
                sx={{
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                }}
              />
            )}
          </Box>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {genres.slice(0, 4).map((genre, i) => (
            <Chip key={i} label={genre} variant="outlined" size="small" />
          ))}
        </Box>

        <Typography variant="h6" sx={{ mb: 1, color: '#1a1a2e' }}>
          Sinopsis
        </Typography>
        <Typography sx={{ 
          color: 'text.secondary',
          lineHeight: 1.8,
          mb: 3,
        }}>
          {movie.overview || 'Sin descripción disponible'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant={isFavorite ? "contained" : "outlined"}
            color="error"
            startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={handleFavorite}
            sx={{ borderRadius: 2 }}
          >
            {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
          </Button>
          <Button
            variant="contained"
            startIcon={<ShareIcon />}
            onClick={handleShare}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            }}
          >
            Compartir
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
