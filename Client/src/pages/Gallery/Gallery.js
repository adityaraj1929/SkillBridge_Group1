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

  // Sample gallery items - replace with your actual images and descriptions
  const galleryItems = [
    {
      id: 1,
      title: "Education Support Program",
      description: "Volunteers helping children with their studies",
      image: "https://source.unsplash.com/800x600/?education"
    },
    {
      id: 2,
      title: "Environmental Clean-up Drive",
      description: "Community effort to clean local beaches",
      image: "https://source.unsplash.com/800x600/?environment"
    },
    {
      id: 3,
      title: "Healthcare Camp",
      description: "Free medical check-up camp for underprivileged",
      image: "https://source.unsplash.com/800x600/?healthcare"
    },
    {
      id: 4,
      title: "Skill Development Workshop",
      description: "Teaching digital skills to youth",
      image: "https://source.unsplash.com/800x600/?workshop"
    },
    {
      id: 5,
      title: "Food Distribution Drive",
      description: "Providing meals to those in need",
      image: "https://source.unsplash.com/800x600/?food,charity"
    },
    {
      id: 6,
      title: "Tree Plantation Initiative",
      description: "Making our community greener",
      image: "https://source.unsplash.com/800x600/?tree,planting"
    },
    {
      id: 7,
      title: "Women Empowerment Program",
      description: "Skills training for women entrepreneurs",
      image: "https://source.unsplash.com/800x600/?women,business"
    },
    {
      id: 8,
      title: "Animal Welfare Project",
      description: "Caring for street animals",
      image: "https://source.unsplash.com/800x600/?animal,care"
    },
    {
      id: 9,
      title: "Tech Education",
      description: "Teaching coding to students",
      image: "https://source.unsplash.com/800x600/?coding,education"
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