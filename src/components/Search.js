import React, { useState, useEffect  } from 'react';


const Search = (props) => {
  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchInputChanges = (e) => {
    setSearchValue(e.target.value);
  }

  const resetInputField = () => {
    setSearchValue('');
  }

  const callSearchFunction = (e) => {
    e.preventDefault();
    if(searchValue){
        props.search(searchValue);
    }
    resetInputField();
  }

  useEffect(() => {
      if(searchValue){
        props.search(searchValue);
      }
  }, [searchValue]); // triggers effect every time searchValue changes

  return (
      <form>
        <input
          value={ searchValue }
          onChange={ handleSearchInputChanges }
          type='text'
        />
        <input onClick={ callSearchFunction } type='submit' value='SEARCH' className='btn btn-secondary ms-1'/>
      </form>
    );
}

export default Search;