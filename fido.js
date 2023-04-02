// fetch input display output (fido)
// Usage: render(html, id, url, options)
// Design: https://vanillajstoolkit.com/boilerplates/revealing-module-pattern/

let fido = (function () {

    /**
     * Fetches data from a given URL with exponential backoff and retries.
     *
     * @async
     * @function
     * @param {string} url - The URL to fetch the data from.
     * @param {Object} [options={}] - The options object to pass to the fetch function (e.g., headers, method, etc.).
     * @param {number} [retries=3] - The number of retries to attempt if the fetch request fails.
     * @param {number} [backoff=500] - The initial backoff duration in milliseconds. This value doubles after each failed retry.
     * @returns {Promise<Object>} - A Promise that resolves with the fetched JSON data if the request is successful.
     * @throws {Response|Error} - Throws a Response object if the fetch request fails after all retries, or an Error object if there's a problem with the fetch request or JSON parsing.
     */
    async function fetcher(url, options = {}, retries = 3, backoff = 500) {
        try {
            const response = await fetch(url, options);
            // The API call was successful!
            if (response.ok) {
                const data = await response.json();
                // This is the JSON from our response
                console.debug(data);
                return data;
            } else {
                if (retries > 0) {
                    console.debug(`fido: ${retries} retries remaining, attempting to fetch(${url}) in ${backoff} ms.`)
                    await new Promise((resolve) => setTimeout(resolve, backoff));
                    return fetcher(url, options, retries - 1, backoff * 2);
                }
                throw response;
            }
        } catch (err) {
            // There was an error
            console.warn(`fido: Unable to fetch(${url}): ${err.status}, ${err.statusText}`, err);

        }
    }

    /**
     * Renders HTML by hydrating a given template with data fetched from a URL using the specified options.
     *
     * @async
     * @function
     * @param {string} html - The HTML template string to be hydrated with the fetched data.
     * @param {string} id - The ID of the DOM element where the hydrated HTML will be inserted.
     * @param {string} url - The URL to fetch the data from.
     * @param {Object} [options={}] - The options object to pass to the fetcher function (e.g., headers, method, etc.).
     * @returns {Promise<void>} - A Promise that resolves when the fetch request completes and the hydrated HTML is inserted into the DOM element.
     * @throws {Response|Error} - Throws a Response object if the fetch request fails, or an Error object if there's a problem with the fetch request or JSON parsing.
     */
    async function render(html, id, url, options) {
        console.debug(`fido render(): ${html}, ${id}, ${url}`)

        const targetElement = document.getElementById(id);

        if (targetElement) {
            try {
                const data = await fetcher(url, options);
                const hydratedHTML = template(html, data);
                targetElement.insertAdjacentHTML('beforeend', hydratedHTML);
            } catch (err) {
                console.error(`fido: ${err}`);
            }
        } else {
            console.error(`fido: The HTML element with id=${id} does not exist.  Failed to render().`);
        }
    }

    /**
     * Replaces placeholders in a template string with corresponding values from a data object.
     *
     * @param {string} templateString - The template string containing placeholders in the format ${variable}.
     * @param {object} data - An object containing key-value pairs, where keys match the variable names in the placeholders.
     * @returns {string} - The template string with placeholders replaced by the corresponding values from the data object. If a variable is not found in the data object, the original placeholder is left unchanged.
     */
    function template(templateString, data) {
        return templateString.replace(/\$\{(\w+)\}/g, (match, variable) => {
            return data.hasOwnProperty(variable) ? data[variable] : match;
        });
    }

    return { render };
})();