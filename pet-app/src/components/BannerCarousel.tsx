// src/components/BannerCarousel.tsx
import { Box, useTheme } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import cirugia from '../assets/banner/cirugia.png';
import consulta from '../assets/banner/consulta.png';
import emergencia from '../assets/banner/emergencias.png';
import vacunacion from '../assets/banner/vacunacion.png';
import estetica from '../assets/banner/estetica.png';
import otros from '../assets/banner/otros.png';

const banners = [
  { id: 1, img: cirugia, alt: 'Servicio de cirugía' },
  { id: 2, img: consulta, alt: 'Consultas veterinarias' },
  { id: 3, img: emergencia, alt: 'Emergencias 24/7' },
  { id: 4, img: vacunacion, alt: 'Vacunación' },
  { id: 5, img: estetica, alt: 'Estética canina' },
  { id: 6, img: otros, alt: 'Otros servicios' },
];
export default function BannerCarousel() {
  const theme = useTheme();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: false,
    appendDots: (dots: React.ReactNode) => (
      <Box 
        sx={{ 
          bottom: 24,
          '& .slick-dots li button:before': {
            color: theme.palette.primary.main,
          },
          '& .slick-dots li.slick-active button:before': {
            color: theme.palette.secondary.main,
          },
        }}
      >
        {dots}
      </Box>
    ),
  };

  return (
    <Box 
      sx={{ 
        maxWidth: '100vw', 
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: 3,
        mx: 'auto',
        mt: 4,
      }}
    >
      <Slider {...settings}>
        {banners.map((banner) => (
          <Box key={banner.id}>
            <Box
              component="img"
              src={banner.img}
              alt={banner.alt}
              sx={{
                    width: '100%',
                    height: 'auto', // ← para que se adapte según la proporción
                    maxHeight: '750px', // opcional: evita que sea muy alto en pantallas grandes
                    display: 'block',
                }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}