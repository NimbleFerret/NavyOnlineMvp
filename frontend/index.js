const container = document.querySelector(".container");
const slider = document.querySelector(".slider");
const slidersCard = document.querySelectorAll(".slider_card");
const btnPrev = document.querySelector("#btn-prev");
const btnNext = document.querySelector("#btn-next");
const slidesCount = slidersCard.length;

let activeSlideIndex = 0;

// slider.style.left = `-${(slidesCount - 1) * 100}vh`;

btnPrev.addEventListener("click", () => {
  changeSlide("left");
});

btnNext.addEventListener("click", () => {
  changeSlide("right");
});

function changeSlide(direction) {
  if (direction === "right") {
    activeSlideIndex++;
    if (activeSlideIndex === slidesCount) {
      activeSlideIndex = 0;
    }
  } else if (direction === "left") {
    activeSlideIndex--;
    if (activeSlideIndex < 0) {
      activeSlideIndex = slidesCount - 1;
    }
  }

  const width = container.clientWidth;

  slider.style.transform = `translateX(-${activeSlideIndex * width}px`;
}
