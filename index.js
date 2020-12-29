'use strict';

const apiKey = 'uygzXAg9JtfXsgtYv2EmHv9sok48ZoljbocJoG75'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatStateCodes(searchTerm) {
  const stateString = searchTerm.join();
  return 'stateCode=' + stateString;
};

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li>
      <h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <p>${responseJson.data[i].url}</p>
      </li>`
    )};
  $('#results').removeClass('hidden');
};

function getParks(searchTerm, maxResults) {
  const params = {
    //stateCode: searchTerm, 
    limit: maxResults, 
    api_key: apiKey,
  };
  const stateCodes = formatStateCodes(searchTerm);
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + stateCodes + '&' + queryString;
  
  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParks(searchTerm, maxResults);
  });
}

$(watchForm);