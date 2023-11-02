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
        this.files = {};
        this.onStartCallback = function() {};
        this.onEndCallback = function() {};
    }

    /**
     *
     * @param {Function} callback
     * @returns {CjsRequest}
     */
    onStart(callback) {
        this.onStartCallback = callback;

        return this;
    }

    /**
     *
     * @param {Function} callback
     * @returns {CjsRequest}
     */
    onEnd(callback) {
        this.onEndCallback = callback;

        return this;
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

        const bodyExists = Object.keys(this.body).length > 0;
        const filesExists = Object.keys(this.files).length > 0;

        if(filesExists && bodyExists) {
            console.log(`${CJS_PRETTY_PREFIX_X} Cannot send files and body data at the same time`);

            return new CjsRequestResult(0, null, true)
        }

        if(bodyExists) {
            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.send(JSON.stringify(this.body));
        } else if(filesExists) {
            //xhr.setRequestHeader("Content-Type", "multipart/form-data");

            const formData = new FormData();

            for(const [key, value] of Object.entries(this.files)) {
                formData.append(key, value)
            }

            xhr.send(formData);
        } else {
            xhr.send();
        }

        xhr.onerror = (e) => {
            return new CjsRequestResult(0, null, true)
        }

        await this.onStartCallback();

        return await new Promise(((resolve, reject) => {
            xhr.onreadystatechange = async () => {
                this.onEndCallback();

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

    /**
     *
     * @param {Object} files
     * @returns {CjsRequest}
     */
    setFiles(files) {
        this.files = files;

        return this;
    }
}