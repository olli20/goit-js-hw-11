const API_KEY = '32051707-22cc9bd81885c5eb5ea8ac825';
const BASE_URL = 'https://pixabay.com/api';

// 
export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.perPage = 10;
        this.page = 1;
        this.totalHits = null;
        // this.isFirstRequest = true;
    }

    fetchImages() {
        console.log(this.searchQuery);

        const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}
        &lang=en&image_type=photo&orientation=horizontal&per_page=10&page=${this.page}`;
        return fetch(url)
            .then(response => response.json())
            .then((response) => {
                this.incrementPage();
                this.totalHits = response.totalHits;
                return response.hits;
            });
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