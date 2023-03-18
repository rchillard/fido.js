let Fido = (function (html, id, url) {
    console.debug(`Fido has loaded: ${html}, ${id}, ${url}`)

    /**
     * Replaces placeholders in a template string with corresponding values from a data object.
     *
     * @param {string} templateString - The template string containing placeholders in the format ${variable}.
     * @param {object} data - An object containing key-value pairs, where keys match the variable names in the placeholders.
     * @returns {string} The template string with placeholders replaced by the corresponding values from the data object. If a variable is not found in the data object, the original placeholder is left unchanged.
     */
    function template(templateString, data) {
        return templateString.replace(/\$\{(\w+)\}/g, (match, variable) => {
            return data.hasOwnProperty(variable) ? data[variable] : match;
        });
    }

    fetch(url).then(function (response) {
        // The API call was successful!
        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(function (data) {
        // This is the JSON from our response
        console.log(data);
        let hydratedHTML = template(html, data);
        document.getElementById(id).insertAdjacentHTML('beforeend', hydratedHTML);
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });

});