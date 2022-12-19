// const onLoadMore = () => {
//     imagesApiService.fetchImages()
//       .then((response) => {
//         hideLoadMoreBtn();

//         insertImages(response);
//         lightbox.refresh();

//         if (imagesApiService.isEnoughImages) {
//           showLoadMoreBtn();
//         } else {
//           Notify.info("We're sorry, but you've reached the end of search results.");
//         };
//       })
//       .catch(onError);
// };