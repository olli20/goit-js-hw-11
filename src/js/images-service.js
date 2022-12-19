const API_KEY = '32051707-22cc9bd81885c5eb5ea8ac825';
const BASE_URL = 'https://pixabay.com/api';
const options = '&image_type=photo&orientation=horizontal&safesearch=true';

// 
export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.perPage = 24;
        this.page = 1;
        this.totalHits = null;
        this.hitsLeft = null;
        this.isEnoughImages = false;
    }

    fetchImages() {
        console.log(this.searchQuery);

        const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}${options}
        &per_page=${this.perPage}&page=${this.page}`;
        return fetch(url)
            .then(response => response.json())
            .then((response) => {
                
                this.hitsUpdate(response);

                this.incrementPage();

                return response.hits;
            });
    }

    hitsUpdate(response) {
        if (this.page === 1) {
                this.totalHits = Number(response.totalHits);
                this.hitsLeft = this.totalHits - this.perPage;
            } else if (this.page > 1) {
                this.hitsLeft -= this.perPage;
            }   
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

};