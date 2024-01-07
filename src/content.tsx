import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React from 'react';
import ReactDOM from 'react-dom';
import { TrailerButton } from "./features/trailer-button";
import { getMovieRating } from "./features/review-link";


export const config: PlasmoCSConfig = {
  matches: ["*://kickasstorrent.cr/*", "*://kickasstorrent.to/*", "*://kickass.sx/*", "*://katcr.to/*", "*://kat.am/*"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
}

// return the movie year
const getMovieYear = ({TorrName}) => {
  
  // extract year
  const yearPattern = /\d{4}/;
  const yearMatch = TorrName.match(yearPattern); // Get the year of the movie
  let year = null;
    if (yearMatch) {
      year = parseInt(yearMatch[0], 10); // Access the first element of the array

      // If year is lower than 1888 then it is not a valid year
      // Get the current year
      const currentYear = new Date().getFullYear();

      // Use the currentYear variable in your code
      if (year < 1888 || year > currentYear + 1) {
        year = null; // or handle this case as needed
      }
    }
  return year;
}

// return movie name
const getMovieName = ({TorrName}) => {
  const sePattern = /S\d{2}E\d{2}/; // Season and episode pattern

  let movieName = TorrName;
  if (getMovieYear({TorrName}) === null) {
    // If year is not found, look for season and episode pattern
    const seMatch = TorrName.match(sePattern);
    if (seMatch) {
        // Split the name at the season and episode pattern 
        movieName = TorrName.split(seMatch[0])[0].trim() + ' ' + seMatch[0];
    } else {
      // If neither year nor season/episode pattern is found
      movieName = TorrName;
    }
  } else {
    // If year is found, split the name at the year
    movieName = TorrName.split(getMovieYear({TorrName}))[0].trim();
  }
  return movieName;
}

// get movie year
const addTrailerColumn = () => {
  const table = document.querySelector('table.data.frontPageWidget');
  if (!table) return;

  // Add header for the Trailer column
  const headerRow = table.querySelector('tr.firstr');
  const trailerHeader = document.createElement('th');
  trailerHeader.textContent = 'Trailer';
  trailerHeader.classList.add('center');
  headerRow.insertBefore(trailerHeader, headerRow.children[1]);

  // Add Trailer button to each row
  const rows = table.querySelectorAll('tr.odd, tr.even');
  rows.forEach(row => {
    const isExcludedRow = row.querySelector('.markeredBlock a[href*="/xxx/"]') !== null; // exclude adult content
    const trailerCell = document.createElement('td'); // create a new cell for the Trailer button
    let TorrName = row.querySelector('a.cellMainLink').textContent; 
    
    let movieNameAndYear = null; // Concatenate the movie name and year
    // print movie name
    console.log(getMovieName({TorrName}));
    // print movie year
    console.log(getMovieYear({TorrName}));


    if (getMovieYear({TorrName}) === null) {
      movieNameAndYear = getMovieName({TorrName});
    } else {
      movieNameAndYear = getMovieName({TorrName}) + ' ' + getMovieYear({TorrName});
    }
    console.log(movieNameAndYear);

    if (!isExcludedRow) {
    // Create a container for the React component
    const trailerButtonContainer = document.createElement('div');
    trailerButtonContainer.classList.add('trailer-button-container');

    // Mount the React component
    ReactDOM.render(<TrailerButton trailerUrl={movieNameAndYear} />, trailerButtonContainer);
    trailerCell.appendChild(trailerButtonContainer);
    } else {
      trailerCell.textContent = 'Not Allowed';
    }
    row.insertBefore(trailerCell, row.children[1]);
  });
};

const addReviewColumn = () => {
  // add Header for the Review column
  const table = document.querySelector('table.data.frontPageWidget');
  if (!table) return;
  const headerRow = table.querySelector('tr.firstr');
  const reviewHeader = document.createElement('th');
  reviewHeader.textContent = 'Review';
  reviewHeader.classList.add('center');
  headerRow.insertBefore(reviewHeader, headerRow.children[2]);

  // Add Review button to each row
  const rows = table.querySelectorAll('tr.odd, tr.even');
  rows.forEach(row => {
    const isExcludedRow = row.querySelector('.markeredBlock a[href*="/xxx/"]') !== null; // exclude adult content
    const reviewCell = document.createElement('td'); // create a new cell for the Trailer button
    let TorrName = row.querySelector('a.cellMainLink').textContent; 
    

    if (!isExcludedRow) {
      // Create a container for the React component
      const reviewContainer = document.createElement('div');
      reviewContainer.classList.add('review-container');
      reviewCell.classList.add('center');

      // Mount the React component
      ReactDOM.render(<getMovieRating movieName={TorrName} />, reviewContainer); // Use the getMovieRating component
      reviewCell.appendChild(reviewContainer);
    } else {
      reviewCell.textContent = 'Not Allowed';
    }
    row.insertBefore(reviewCell, row.children[2]);
    
  });
}


addTrailerColumn();
addReviewColumn();

export default PlasmoOverlay
