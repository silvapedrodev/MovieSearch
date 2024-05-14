import { MovieDatabase } from "./MovieDatabase.js"


export class Movies {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@movie-searched')) || []
  }

  save() {
    localStorage.setItem('@movie-searched', JSON.stringify(this.entries))
  }

  async add(movie) {
    try {
      const dataMovie = await MovieDatabase.search(movie)

      if(dataMovie.Title === undefined) {
        throw new Error('Sorry, the movie you searched for could not be found. Please try again with a different title or IMDb ID')
      }

      this.entries = [dataMovie]
      this.update()
      this.save()

    } catch(error) {
      this.openModal(error.message)
    }
  }
}



export class MoviesView extends Movies {
  constructor(root) {
    super(root) 

    this.results = this.root.querySelector(".result")
    this.btnSave = this.root.querySelector('.custom-svg')
    this.modal = this.root.querySelector('.modal-error')
    this.alertClose = this.modal.querySelector('.alert button')
    this.alert = this.modal.querySelector(".alert")

    this.alertClose.addEventListener('click', () => {
      this.closeModal();
    });

    this.onSearch()
    this.buttonSave()
    this.checkSave()
    this.update()
  }


  onSearch() {
    const btnSearch = this.root.querySelector(".btnSearch")
    const inputSearch = this.root.querySelector("#input-search")

    btnSearch.onclick = () => {
      const {value} = inputSearch
      this.add(value)
    }

    inputSearch.onkeypress = (event) => {
      if(event.key === "Enter") {
        const value = inputSearch.value;
        this.add(value)
      }
    }
  }

  update() {
    this.removeResultDiv();
    this.createResult()

    this.entries.forEach(movie => {
    const infoMovie = this.createResult()
    
    document.title = `Movie Search - ${movie.Title}`
    infoMovie.querySelector(".title span").textContent = movie.Title
    infoMovie.querySelector(".info li:nth-child(1)").textContent = movie.Year
    infoMovie.querySelector(".info li:nth-child(2)").textContent = movie.Rated
    infoMovie.querySelector(".info li:nth-child(3)").textContent = movie.Runtime
    infoMovie.querySelector(".poster img").src = movie.Poster
    infoMovie.querySelector(".poster img").alt = `Movie poster for ${movie.Title}`
    infoMovie.querySelector(".poster > p").textContent = movie.Plot
    infoMovie.querySelector(".rating span").textContent = movie.imdbRating
    infoMovie.querySelector(".rating a").href = `https://www.imdb.com/title/${movie.imdbID}/ratings/`
    infoMovie.querySelector(".imdbID span").textContent = movie.imdbID
    infoMovie.querySelector(".language span").textContent = movie.Country
    infoMovie.querySelector(".metascore span").textContent = movie.Metascore
    infoMovie.querySelector(".metascore span").style.backgroundColor = this.colorMeta(movie.Metascore)
    infoMovie.querySelector(".metascore a").href = `https://www.imdb.com/title/${movie.imdbID}/criticreviews/`

    this.results.append(infoMovie)
    this.createGenreMovie(movie.Genre)
   })
  }

  colorMeta(metascoreValue) {
    if(metascoreValue >= 0 && metascoreValue <= 39){
      return "var(--metaRed)"
    } else if(metascoreValue <= 60) {
      return "var(--metaYellow)"
    } else if(metascoreValue <= 100) {
      return "var(--metaGreen)"
    } else {
      return "var(--metaNA)"
    }
  }

  createResult() {
    const resultMovies = document.createElement("div")
    resultMovies.classList.add("movie-data")

    resultMovies.innerHTML = `
  
    <div class="info">
      <h2 class="title">
        <span>Guardians of the Galaxy Vol. 2</span>
      </h2>
      
      <ul>
        <li>2017</li>
        <li>PG-13</li>
        <li>136 min</li>
      </ul>
    </div>

    <div class="poster">
      <img src="https://m.media-amazon.com/images/M/MV5BNjM0NTc0NzItM2FlYS00YzEwLWE0YmUtNTA2ZWIzODc2OTgxXkEyXkFqcGdeQXVyNTgwNzIyNzg@._V1_SX300.jpg" alt="image movie poster">

      <div id="genre">
      </div>

      <p>The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father, the ambitious celestial being Ego.</p>

      <div class="imdb">
        <div class="imdbInfo">
          <div class="rating">
            <p>IMDb RATING</p>
              <a href="https://www.imdb.com/title/tt3896198/ratings/" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="ipc-icon ipc-icon--star sc-bde20123-4 frBGmx" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M12 17.27l4.15 2.51c.76.46 1.69-.22 1.49-1.08l-1.1-4.72 3.67-3.18c.67-.58.31-1.68-.57-1.75l-4.83-.41-1.89-4.46c-.34-.81-1.5-.81-1.84 0L9.19 8.63l-4.83.41c-.88.07-1.24 1.17-.57 1.75l3.67 3.18-1.1 4.72c-.2.86.73 1.54 1.49 1.08l4.15-2.5z"></path></svg>
                <span>7.6</span>
              </a>
          </div>
          <div class="imdbID">
            <p>IMDb ID</p>
            <span>tt3896198</span>
          </div>
          <div class="language">
            <p>Country</p>
            <span>United States</span>
          </div>
        </div>
        <div class="metascore">
          <div>
            <span>67</span>
            <a href="https://www.metacritic.com/movie/guardians-of-the-galaxy-vol-2" target="_blank">Metascore</a>
          </div>
        </div>
      </div>
    </div>
    `
    return resultMovies
  }

  openModal(messageError) {
    const message = document.querySelector(".alert p")
    
    this.modal.classList.add('open');
    this.alert.classList.add('open')
    document.body.classList.add('modal-open');
    message.textContent = messageError
  }

  closeModal() {
    this.modal.classList.remove('open');
    this.alert.classList.remove('open')
    document.body.classList.remove('modal-open');
  }

  createGenreMovie(genres) {
    const genreDiv = document.querySelector("#genre");
    genreDiv.innerHTML = ""

    genres.split(',').forEach(genre => {
      const span = document.createElement('span');
      const a = document.createElement('a');
      a.href = `https://www.imdb.com/search/title/?genres=${genre.trim()}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = genre.trim();
      span.appendChild(a);
      genreDiv.appendChild(span);
    })
  }

  buttonSave() {
    const isButtonActive = localStorage.getItem('btnSaveState') === 'active';

    if (isButtonActive) {
      this.btnSave.classList.add('saveOn');
    }
  
    this.btnSave.addEventListener('click', () => {
     
        this.btnSave.classList.toggle('saveOn');

        if (this.btnSave.classList.contains('saveOn')) {
            localStorage.setItem('btnSaveState', 'active');
            this.save();
        } else {
          localStorage.removeItem('btnSaveState');
        }
    });
  }

  checkSave() {
    const isButtonActive = this.btnSave.classList.contains('saveOn');
    const localStorageData = JSON.parse(localStorage.getItem('@movie-searched'));

    if (isButtonActive && localStorageData) {
        this.entries = localStorageData
    } else {
        localStorage.removeItem('@movie-searched');
        this.entries = [];
    }

    this.update();
}

  removeResultDiv() {
    this.results.querySelectorAll('div')
      .forEach((div) => {
       div.remove()
      })
  }
}