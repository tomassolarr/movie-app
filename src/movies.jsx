import { Card, CardMedia, CardContent, Typography, CardActions, Button, Chip, Box } from "@mui/material"
import { useState, useEffect } from "react"
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';

export default function Movie({ id, name, description, image, rating, releaseDate, onShare, onClick, index }) {
  const [isFavorite, setIsFavorite] = useState(
    localStorage.getItem(`movie_${id}_favorite`) === 'true'
  )
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 50)
    return () => clearTimeout(timer)
  }, [index])

  useEffect(() => {
    setIsFavorite(localStorage.getItem(`movie_${id}_favorite`) === 'true')
  }, [id])

  const handleFavoriteClick = (e) => {
    e.stopPropagation()
    const newValue = !isFavorite
    setIsFavorite(newValue)
    if (newValue) {
      localStorage.setItem(`movie_${id}_favorite`, 'true')
    } else {
      localStorage.removeItem(`movie_${id}_favorite`)
    }
  }

  const handleShareClick = (e) => {
    e.stopPropagation()
    onShare?.({ name })
  }

  const handleCardClick = () => {
    onClick?.()
  }

  return (
    <Box
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`,
      }}
    >
      <Card
        sx={{
          maxWidth: 345,
          borderRadius: 4,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: isHovered 
            ? '0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(25, 118, 210, 0.2)' 
            : '0 4px 20px rgba(0,0,0,0.1)',
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          overflow: 'hidden',
          position: 'relative',
          cursor: onClick ? 'pointer' : 'default',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1976d2, #42a5f5, #7c4dff)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover': {
            boxShadow: '0 25px 50px rgba(0,0,0,0.35), 0 0 40px rgba(25, 118, 210, 0.25)',
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            sx={{ 
              height: 450,
              transition: 'transform 0.4s ease',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
            image={image}
            title={name}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: isHovered 
                ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)' 
                : 'transparent',
              transition: 'background 0.3s ease',
              pointerEvents: 'none',
            }}
          />
          <Chip
            icon={<StarIcon sx={{ color: '#ffd700' }} />}
            label={rating?.toFixed(1) || 'N/A'}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(0,0,0,0.75)',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
              },
            }}
          />
          {isHovered && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                right: 12,
                display: 'flex',
                gap: 1,
                justifyContent: 'center',
                animation: 'fadeInUp 0.3s ease',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <Button
                variant="contained"
                size="small"
                startIcon={<ShareIcon />}
                onClick={handleShareClick}
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                Compartir
              </Button>
            </Box>
          )}
        </Box>
        <CardContent sx={{ pb: 2 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: '1.1rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '3.3em',
              color: '#1a1a2e',
            }}
          >
            {name}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              minHeight: '4.5em',
              fontSize: '0.85rem',
              lineHeight: 1.5,
            }}
          >
            {description || 'Sin descripción disponible'}
          </Typography>
          {releaseDate && (
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                mt: 1,
                color: '#666',
                fontWeight: 500,
              }}
            >
              📅 {releaseDate}
            </Typography>
          )}
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
          <Button 
            size="small" 
            onClick={handleFavoriteClick}
            startIcon={isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            sx={{
              color: isFavorite ? '#e53935' : '#666',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {isFavorite ? 'Favorito' : 'Agregar'}
          </Button>
          <Button
            size="small"
            onClick={(e) => { e.stopPropagation(); onClick?.() }}
            sx={{
              color: '#1976d2',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'rgba(25, 118, 210, 0.08)',
                transform: 'translateX(4px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Ver detalles →
          </Button>
        </CardActions>
      </Card>
    </Box>
  )
}
