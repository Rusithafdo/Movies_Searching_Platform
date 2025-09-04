import React, { use } from "react";
import Search from "./components/Search";
import { useState, useEffect } from "react";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";

// API - Application Programmin Interface - a set of rules that allows one softwarare application to talk to another
const API_BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};


const App = () => {

  const [searchTerm, setSearchTerm] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  // In react app we have to have this loading state

  const [debouncedSearchTerm , setDebouncedSearchTerm] =  useState('');  // useDebounce is a custom hook that will debounce the search term

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user stops typing for 1000ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm]);   //* this useDebounce optimize the performance of the search funtionality

  const fetchMovies = async (query = '') => {

    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sortby=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      const data = await response.json();

      if(data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

         //* update the search count with appwrite software
         if (query && data.results.length > 0) {
           await updateSearchCount(query, data.results[0]);
         }

      // console.log(data);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);  // stop the loading
    }
  };



  useEffect(() => {

    fetchMovies(debouncedSearchTerm);

  }, [debouncedSearchTerm]);



  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies </span> You'll Enjoy
            without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} className="search" />
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>
          {isLoading ? (
              <Spinner /> // if isLoading is true, show loading message
            ) : (
              errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>  // if errorMessage is true, show error message
              ) : (
                <ul>
                  {movieList.map((movie) => (
                    // <p key={movie.id} className="text-white">{movie.title}</p>
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </ul>
              )
            )
          }
        </section>
      </div>
    </main>
  );
};

export default App;
