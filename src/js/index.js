import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import ImagesApiService from './images-service';
import getRefs from './get-refs';

const refs = getRefs();

const imagesApiService = new ImagesApiService;
var lightbox = new SimpleLightbox('.gallery a');

const onSubmit = (event) => {
    event.preventDefault();
    hideLoadMoreBtn();
    clearImagesContainer();
  
    const { value } = event.currentTarget.elements.searchQuery;
  
    if (value.trim() === "") {
        Notify.failure("Please, enter your search request.");
        return;
      };
  
    imagesApiService.searchQuery = value.trim();
    imagesApiService.resetPage();
  
    imagesApiService.fetchImages()
        .then((response) => {
          if (response.length === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
          };

          insertImages(response);
          lightbox.refresh();

          if (imagesApiService.isEnoughImages) {
            showLoadMoreBtn();
          };
          
          Notify.success(`Hooray! We found ${imagesApiService.totalHits} images.`);
         })
    .catch(onError);
};

const onLoadMore = async () => {
  hideLoadMoreBtn();

  const response = await imagesApiService.fetchImages();
  try {
    const data = await response;
    insertImages(data);

    lightbox.refresh();
    
    if (imagesApiService.isEnoughImages) {
        showLoadMoreBtn();
      } else {
        Notify.info("We're sorry, but you've reached the end of search results.");
    };
    
  } catch (error) {
    onError();
    return error;
  }
};

const clearImagesContainer = () => {
    refs.imagesContainer.innerHTML = '';
};

const imageTpl = ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
<a class="photo-link" href="${largeImageURL}">
  <div class="photo-card">
    <div class="photo-thumb">
      <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </div>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>
</a>
`;

const insertImages = (response) => {
    let markup = '';
    for (let i = 0; i < response.length; i += 1) {
        markup += imageTpl(response[i]);
    };
  refs.imagesContainer.insertAdjacentHTML('beforeend', markup);
};

const showLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

const hideLoadMoreBtn = () => {
  refs.loadMoreBtn.classList.add('is-hidden');
}

const onError = () => {
  Notify.failure("Something went wrong! Please, check your Internet connection or try later.");
}

refs.searchForm.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);