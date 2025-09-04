import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className='search'>
        <div className="">
            <img src="search.svg" alt="search" />

            <input 
                type="text" 
                placeholder='Search through thousands of movies'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    </div>
  )
}

export default Search;

// this componets only keep track on the Search bar/term, so no need for state we create that inside the app.jsx to fetch the movies.
// and then we take useState variable as a prop and pass it to the Search component