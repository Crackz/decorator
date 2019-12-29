export const cleanObject = obj => {
    const newObj = {};

    Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === "object") {
            newObj[key] = cleanObject(obj[key]); // recurse
        } else if (obj[key] != null && obj[key] !== "") {
            newObj[key] = obj[key]; // copy value
        }
    });

    return newObj;
};