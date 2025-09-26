import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  Modal,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Gallery items with local images
  const galleryItems = [
    {
      id: 1,
      title: "Education Support Program",
      description: "Volunteers helping children with their studies",
      image: "/images/gallery/education.jpg"
    },
    {
      id: 2,
      title: "Environmental Clean-up Drive",
      description: "Community effort to clean local beaches",
      image: "/images/gallery/environment.jpg"
    },
    {
      id: 3,
      title: "Healthcare Camp",
      description: "Free medical check-up camp for underprivileged",
      image: "/images/gallery/healthcare.jpg"
    },
    {
      id: 4,
      title: "Skill Development Workshop",
      description: "Teaching digital skills to youth",
      image: "/images/gallery/workshop.jpg"
    },
    {
      id: 5,
      title: "Food Distribution Drive",
      description: "Providing meals to those in need",
      image: "/images/gallery/food.jpg"
    },
    {
      id: 6,
      title: "Community Support",
      description: "Making our community stronger together",
      image: "/images/gallery/community.jpg"
    }
  ];

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Impact Gallery
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Showcasing Our Volunteer Projects and Their Impact
        </Typography>
      </Box>

      {/* Gallery Grid */}
      <Grid container spacing={4}>
        {galleryItems.map((item) => (
          <Grid item key={item.id} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
              onClick={() => handleImageClick(item)}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Image Modal */}
      <Modal
        open={Boolean(selectedImage)}
        onClose={handleClose}
        aria-labelledby="image-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ 
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: 'background.paper',
          borderRadius: 1,
          p: 2
        }}>
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(90vh - 100px)',
                  objectFit: 'contain'
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">{selectedImage.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedImage.description}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default Gallery;