# fido

FIDO is an acronym for Fetch Input Display Output (FIDO).  

This is a small JavaScript library that accepts HTML as a regular String, a reference to a parent DOM element, and a URL for an endpoint with JSON data.  FIDO fetches data from the URL, hydrates the HTML template, and updates the DOM.  It has meaningful network handling, as well as the concept of internal state.

## Background

After having written the same boilerplate code for many different projects, I decided to create this library.  Often times, I have found that many simple pages feature a single large component, fetch data to populate that component, then render the result to the DOM.  fidojs makes this task easy.

## Usage

This is still under construction.  Usage will be updated when the project is ready for distribution.