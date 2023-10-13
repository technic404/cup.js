class CjsRequestResult {
    /**
     *
     * @param {Number} statusCode
     * @param {String} responseText
     * @param {Boolean} networkError
     */
    constructor(statusCode, responseText, networkError) {
        this.statusCode = statusCode;
        this.responseText = responseText;
        this.networkError = networkError;
    }

    getStatusCode() {
        return this.statusCode;
    }

    isError() {
        return this.statusCode !== 200 || this.networkError;
    }

    isNetworkError() {
        return this.networkError;
    }

    text() {
        return this.responseText;
    }

    json() {
        return JSON.parse(this.responseText);
    }

    /**
     *
     * @param {Number} code
     * @param {Function} callback
     */
    onStatus(code, callback) {
        if(this.statusCode === code) {
            callback();
        }
    }
}

class CjsRequest {
    /**
     *
     * @param {String} url
     * @param {"post"|"get"|"options"|"head"|"patch"|"delete"|"put"} method
     */
    constructor(url, method) {
        this.url = url;
        this.method = method;
        this.query = {};
        this.body = {};
        this.headers = {};
    }

    /**
     *
     * @return {Promise<CjsRequestResult>}
     */
    async doRequest() {
        const xhr = new XMLHttpRequest();

        let url = this.url;

        if(this.method === "get") {
            url += `?${Object.keys(this.query).map(e => { return `${e}=${this.query[e]}` }).join("&")}`
        }

        xhr.open(this.method, url, true);

        for(const [key, value] of Object.entries(this.headers)) {
            xhr.setRequestHeader(key, `${value}`);
        }

        const bodyExists = this.body !== {};

        if(bodyExists) {
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.send(JSON.stringify(this.body));
        } else {
            xhr.send();
        }

        xhr.onerror = (e) => {
            return new CjsRequestResult(
                0,
                null,
                true
            )
        }

        return await new Promise(((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if(xhr.readyState !== 4) return;

                resolve(
                    new CjsRequestResult(
                        xhr.status,
                        xhr.responseText,
                        (xhr.status === 0)
                    )
                )
            }
        }))
    }

    /**
     *
     * @param {Object} query
     * @return {CjsRequest}
     */
    setQuery(query) {
        this.query = query;

        return this;
    }

    /**
     *
     * @param {Object} headers
     * @returns {CjsRequest}
     */
    setHeaders(headers) {
        this.headers = headers;

        return this;
    }

    /**
     *
     * @param {Object} body
     * @returns {CjsRequest}
     */
    setBody(body) {
        this.body = body;

        return this;
    }
}