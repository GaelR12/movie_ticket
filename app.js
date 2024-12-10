const movieCard = {
    // NOTE: Template that displays movie card 
    template: `
    <div class="movie-card">
        <!-- Movie Title -->
        <h3><i class="fa-solid fa-film"></i> {{ movie.title }}</h3>
        <!-- Movie Poster -->
        <img :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path" alt="Movie Img">
        <!-- Movie Overview -->
        <p>{{ movie.overview }}</p>
        
        <!-- Input for adult tickets -->
        <label for="adults">Adults:</label>
        <input type="number" v-model="adults" min="0" max="10" id="adults">

        <!-- Input for child tickets -->
        <div>
            <label for="children">Children:</label>
            <input type="number" v-model="children" min="0" max="10" id="children">
        </div>
        
        <!-- Button to add tickets -->
        <div>
            <button @click="addToCart"><i class="fa fa-cart-plus"></i>Add to Cart</button>
        </div>
    </div>
    `,
    props: ['movie'], // NOTE: Accept movie data from the parent component
    data() {
        return {
            adults: 0,  // NOTE: Default number of adult tickets is 0
            children: 0 // NOTE: Default number of child tickets is 0
        };
    },
    methods: {
        // NOTE: Method to add the movie and tickets to the cart
        addToCart() {
            this.$emit('add-ticket', {
                movie: this.movie,
                adults: this.adults,
                children: this.children,
                subtotal: this.calculateSubtotal() // NOTE: Calculate the total for the movie
            });
            // NOTE: Reset the input fields after adding to cart
            this.adults = 0;
            this.children = 0;
        },
        // NOTE: Method to calculate the subtotal for the tickets
        calculateSubtotal() {
            const adultPrice = 10; // INFO: Price for adult tickets
            const childPrice = 5;  // INFO: Price for child tickets
            return (this.adults * adultPrice) + (this.children * childPrice); // Total cost for this movie
        }
    }
};

const app = Vue.createApp({
    components: {
        'movie-card': movieCard // INFO: Register the movie-card component
    },
    data() {
        return {
            movies: [], // INFO: Array to hold the list of movies
            cart: []    // INFO: Array to hold the shopping cart items
        };
    },
    created() {
        this.fetchMovies(); // NOTE: Fetch movies when the app is created
    },
    methods: {
        // INFO: Method to fetch movie data from the API
        async fetchMovies() {
            // NOTE: The API key for movie data
            const apiKey = 'dfa6d9eacc8cb566798ebf04f9449eb6'; 
            const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`;
            // NOTE: Fetch movie data from the API
            const response = await fetch(url); 
            // NOTE: Parse the JSON response
            const data = await response.json(); 
            this.movies = data.results.slice(0, 4);// IDEA: Change the y value to display amount(movies)
        },
        // NOTE: Method to add ticket to the cart
        addTicket(ticket) {
            // NOTE: Checks if the movie is already in the cart
            const existingMovie = this.cart.find(item => item.movie.id === ticket.movie.id);
            if (existingMovie) {
                // INFO: If movie is already in the cart, update the ticket count
                existingMovie.adults += ticket.adults;
                existingMovie.children += ticket.children;
                existingMovie.subtotal = this.calculateSubtotal(existingMovie);
            } else {
                // INFO: If it's not in the cart, add a ticket once submit
                this.cart.push(ticket);
            }
        },
        // NOTE: Method to remove movie from the cart
        removeMovie(index) {
            this.cart.splice(index, 1); // NOTE: Remove the item from the cart
        },
        // NOTE: Method to calculate the total for the cart
        calculateSubtotal(item) {
            const adultPrice = 10; // INFO: Price for adult tickets
            const childPrice = 5;  // INFO: Price for child tickets
            return (item.adults * adultPrice) + (item.children * childPrice); // INFO: Calculate subtotal
        }
    },
    computed: {
        // INFO: Computed property to calculate total adults ticket cost
        totalAdults() {
            return this.cart.reduce((sum, item) => sum + (item.adults * 10), 0); // INFO: Sum of all adult tickets
        },
        // INFO: Computed property to calculate total children's ticket cost
        totalChildren() {
            return this.cart.reduce((sum, item) => sum + (item.children * 5), 0); // INFO: Sum of all children tickets
        },
        // INFO: Computed property to calculate total cost (adults + children)
        total() {
            return this.totalAdults + this.totalChildren; // INFO: Total cost
        }
    }
});

app.mount('#app');