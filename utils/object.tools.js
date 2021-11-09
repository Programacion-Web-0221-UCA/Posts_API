const tools = {};

tools.sanitizeObject = (object) => {
    const result = {};

    Object.keys(object).forEach(key => { 
        if (object[key] !== undefined) {
            result[key] = object[key]
        }
    });

    return result;
}

module.exports = tools;