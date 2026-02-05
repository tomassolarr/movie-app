import { Card, CardMedia, CardContent, Skeleton, CardActions, Box } from "@mui/material"

export default function MovieSkeleton({ index }) {
  return (
    <Box
      sx={{
        opacity: 0,
        animation: `fadeIn 0.5s ease ${index * 0.05}s forwards`,
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Card
        sx={{
          maxWidth: 345,
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          overflow: 'hidden',
        }}
      >
        <Skeleton
          variant="rectangular"
          height={450}
          animation="wave"
          sx={{
            background: '#e0e0e0',
          }}
        />
        <CardContent sx={{ pb: 2 }}>
          <Skeleton
            variant="text"
            width="80%"
            height={32}
            animation="wave"
            sx={{
              background: '#e0e0e0',
              mb: 1,
            }}
          />
          <Skeleton
            variant="text"
            width="100%"
            height={20}
            animation="wave"
            sx={{
              background: '#e0e0e0',
              mb: 0.5,
            }}
          />
          <Skeleton
            variant="text"
            width="90%"
            height={20}
            animation="wave"
            sx={{
              background: '#e0e0e0',
              mb: 0.5,
            }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={20}
            animation="wave"
            sx={{
              background: '#e0e0e0',
              mb: 0.5,
            }}
          />
          <Skeleton
            variant="text"
            width="30%"
            height={16}
            animation="wave"
            sx={{
              background: '#e0e0e0',
              mt: 1,
            }}
          />
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Skeleton
            variant="rectangular"
            width={80}
            height={32}
            animation="wave"
            sx={{
              borderRadius: 2,
              background: '#e0e0e0',
            }}
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={32}
            animation="wave"
            sx={{
              borderRadius: 2,
              ml: 'auto',
              background: '#e0e0e0',
            }}
          />
        </CardActions>
      </Card>
    </Box>
  )
}
