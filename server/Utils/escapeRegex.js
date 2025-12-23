// server/Utils/escapeRegex.js
module.exports = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
