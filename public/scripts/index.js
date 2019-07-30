const carouselImages = Array.from(
  document.querySelectorAll('.carousel__image')
);
const previousButton = document.querySelector('.previous-button');
const nextButton = document.querySelector('.next-button');
let currentImage = 0;

function showNextImage() {
  currentImage = ++currentImage % carouselImages.length;
  showImage();
}

function showPreviousImage() {
  if (currentImage === 0) currentImage = carouselImages.length;
  currentImage = Math.abs(--currentImage % carouselImages.length);
  showImage();
}

function showImage() {
  carouselImages.forEach((element, index) => {
    if (currentImage !== index) {
      element.classList.add('hide-photo');
    } else {
      element.classList.remove('hide-photo');
    }
  });
}

nextButton.addEventListener('click', showNextImage);
previousButton.addEventListener('click', showPreviousImage);
