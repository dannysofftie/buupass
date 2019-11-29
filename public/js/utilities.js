/**
 * Extracts data from form and returns an iterable
 *
 * @param {HTMLFormElement} form HTMLFormElement
 *
 * @returns
 */
function extractFormData(form) {
    if (typeof form === 'undefined') {
        throw new Error('Requires a form to iterate');
    } else {
        var data = {};
        // reset object values first before iterating form
        Object.getOwnPropertyNames(data).forEach(key => {
            delete data[key];
        });
        for (var element of Array.from(form.elements)) {
            ['text', 'number', 'url', 'textarea', 'password', 'email', 'hidden', 'tel'].forEach(type => {
                if (element.type.indexOf(type) !== -1) {
                    data[element.name.trim()] = element.value.trim();
                }
            });
            if (element.type === 'file') {
                data[element.name.trim()] = element.files[0];
            }
            if (element.type.indexOf('select') !== -1) {
                if (element.getAttribute('multiple')) {
                    try {
                        var multiValues = [];
                        var options = Array.from(element.querySelectorAll('option'));
                        for (var option of options) {
                            if (option.selected) {
                                multiValues.push(option.value.trim());
                            }
                        }
                        data[element.name.trim()] = multiValues;
                    } catch (err) {
                        //
                    }
                } else {
                    data[element.name.trim()] = element.value.trim();
                }
            }
            // @ts-ignore
            if (element.type === 'checkbox' && element.checked) {
                data[element.name.trim()] = element.checked;
            }
            // @ts-ignore
            if (element.type === 'radio' && element.checked) {
                data[element.name.trim()] = element.value.trim();
            }
        }

        // delete entries with empty keys
        Object.keys(data).forEach(key => key.length < 1 && delete data[key]);

        return data;
    }
}

/**
 * checks if cookie exists and returns all cookies, or cookie value if cookie name is passed
 * @param {string} cookieString
 * @param {string=} cookieName
 */
function extractCookies(cookieName) {
    // @ts-ignore
    var c = decodeURIComponent(document.cookie);
    var d;
    var e = {};
    if (c.length < 1) {
        return false;
    }
    if (c.indexOf(';') !== -1) {
        d = c.split(';');
    } else {
        d = c;
    }
    if (typeof d === 'string') {
        e[d.split('=')[0].trim()] = d.split('=')[1].trim();
    } else {
        d.map(p => (e[p.split('=')[0].trim()] = p.split('=')[1].trim()));
    }

    if (typeof cookieName !== 'undefined') {
        return e[cookieName];
    }
    return e;
}

/**
 *
 * Make ajax request. Wraps axios global object to include authorization token to the request header
 *
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method
 * @param {string} url
 * @param {object} data
 * @param {boolean} file - pass true if there is a file to upload
 * @returns {Promise<{data: {data: any; error: string; message: string}; status: {}}>}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function makeRequest(method, url, data, file) {
    var headers = {
        Authorization: 'Bearer ' + extractCookies('token'),
        'X-Requested-With': 'XMLHttpRequest',
    };

    if (file) {
        var formdata = new FormData();

        Object.keys(data).forEach(function(key) {
            formdata.append(key, data[key]);
        });

        data = formdata;

        headers['Content-Type'] = 'multipart/form-data; boundary=' + data._boundary;

        return axios({
            method,
            url,
            headers,
            data,
        }).catch(function(er) {
            return er['response'];
        });
    }

    if (!data) {
        return axios({
            method,
            url,
            headers,
        }).catch(function(er) {
            return er['response'];
        });
    }

    return axios({
        method,
        url,
        headers,
        data,
    }).catch(function(er) {
        return er['response'];
    });
}
