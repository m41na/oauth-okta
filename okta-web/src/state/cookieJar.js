export const cookieMaxAge = 24 * 60 * 60 * 1000; //1 day

export const cookieExpiryDate = () => {
    const date = new Date();
    date.setTime(date.getTime() + (cookieMaxAge));
    return date.toUTCString();
}

export const getCookieValue = (name) => {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(`${name}=`))
        .split('=')[1];
}

export const checkCookieExists = name => {
    return document.cookie
        .split('; ')
        .some((row) => row.startsWith(`${name}=`))
}

export const setDocumentCookie = json => {
    const cookies = jsonToCookie(json);
    cookies.forEach(cookie => document.cookie = cookie);
}

export const clearDocumentCookie = () => {
    const expiredCookie = setCookieAsExpired(document.cookie);
    setDocumentCookie(expiredCookie);
}

//assumes object is a flat map - has no nested object
export const jsonToCookie = json => {
    if (!json.expires_in) {
        json.expires_in = cookieExpiryDate();
    }
    return Object.keys(json).map(key => `${key}=${json[key]}`);
}

export const cookieToJson = cookies => {
    return cookies.split("; ")
        .map(row => row.split("="))
        .reduce((acc, curr) => {
            acc[curr[0]] = curr[1];
            return acc;
        }, {});
}

export const setCookieExpiry = cookie => {
    const json = cookieToJson(cookie);
    json.expires_in = cookieExpiryDate();
    return jsonToCookie(json);
}

export const setCookieAsExpired = cookie => {
    const json = cookieToJson(cookie);
    json.expires_in = "Thu, 01 Jan 1970 00:00:00 UTC";
    return jsonToCookie(json);
}
