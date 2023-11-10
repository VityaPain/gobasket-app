import React from "react";

import Slider from "react-slick";

const CourtSlider = ({images}) => {
  const settings = {
    dots: true,
    // infinite: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true  
  };

  const renderSlides = (arr) => {
    const res = arr.map((img, i) => {
      return (
        <img src={img} key={i} alt="court photo"/>
      )
    })

    return res
  }


  const slides = renderSlides(images)


  return (
    <Slider {...settings}>
      {slides}
    </Slider>
  )
}

export default CourtSlider