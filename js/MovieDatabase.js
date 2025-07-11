export class MovieDatabase {
  static search(movieName) {
    const myKey = "OMDB_API_KEY"
    let endpoint 

    if(movieName.startsWith("tt")){
      endpoint = `https://www.omdbapi.com/?i=${movieName}&apikey=${myKey}`
    } else {
      endpoint = `https://www.omdbapi.com/?apikey=${myKey}&t=${movieName}`
    }

    return fetch(endpoint)
      .then(data => data.json())
      .then(
        ({Title, Year, Rated, Runtime, Poster, Genre, Plot, imdbRating, imdbID, Country,  Metascore}) => (
          
        {
          Title,
          Year,
          Rated,
          Runtime,
          Poster,
          Genre,
          Plot,
          imdbRating,
          imdbID,
          Country,
          Metascore
        }))
  }
}