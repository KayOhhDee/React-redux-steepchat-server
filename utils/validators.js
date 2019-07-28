const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};


exports.verifyUserInfo = (data) => {
  let userInfo = {};

  if(!isEmpty(data.bio.trim())) userInfo.bio = data.bio;
  if(!isEmpty(data.website.trim())) {
    if(data.website.trim().substring(0, 4) !== 'http') {
      userInfo.website = `http://${data.website.trim()}`
    } else userInfo.website = data.website;
  }
  if(!isEmpty(data.location.trim())) userInfo.location = data.location;

  return userInfo;
}