"use strict";

const Chance = require("chance");
const chance = new Chance();

const md5 = require('md5');

module.exports = {

  generateRandomUser: (loginID) => {
    const gender    = chance.gender();
    const firstName = chance.first({gender: gender});
    const lastName  = chance.last();
    const userName  = (loginID) ? loginID : firstName + " " + lastName;

    let userHandle = "@" + userName;


    if (Math.random() > 0.5) {
      const suffix = Math.round(Math.random() * 100);
      userHandle += suffix;
    }

    const avatarUrlPrefix = `https://vanillicon.com/${md5(userHandle)}`;
    const avatars = {
      small:   `${avatarUrlPrefix}_50.png`,
      regular: `${avatarUrlPrefix}.png`,
      large:   `${avatarUrlPrefix}_200.png`
    }

    return {
      name: userName,
      handle: userHandle,
      avatars: avatars
    };
  }
};
