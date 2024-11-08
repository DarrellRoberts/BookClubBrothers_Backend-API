const { commentBadge } = require("./badges/commentBadge");
const { firstBookBadge } = require("./badges/firstBookBadge");
const { updateUserLoneWolfBadge } = require("./badges/loneWolfBadge");
const { updateUserMostBooksBadge } = require("./badges/mostBooksBadge");
const { punctualBadge } = require("./badges/punctualBadge");
const { calculateAverageRating } = require("./bookScore");

module.exports = {
  calculateAverageRating,
  commentBadge,
  firstBookBadge,
  updateUserLoneWolfBadge,
  updateUserMostBooksBadge,
  punctualBadge,
};
