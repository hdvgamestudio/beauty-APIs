
var ApiErrors = function () { };

ApiErrors.RESOURCE_NOT_FOUND_REQ = {
  code: 99,
  msg: "Resource not found in the request"
};
/*--- User ---*/
//post
ApiErrors.USER_NOT_FOUND_REQ = {
  code: 0,
  msg: "User not found in the request"
};
ApiErrors.ACCOUNT_TYPE_REQUIRED = {
  code: 1,
  msg: "'account_type' field is required"
};
ApiErrors.USERNAME_REQUIRED = {
  code: 2,
  msg: "User's name is required"
};
ApiErrors.PWD_REQUIRED = {
  code: 3,
  msg: "User's password is required"
};

ApiErrors.USERNAME_EXISTED = {
  code: 4,
  msg: "User's name already exsited"
};
ApiErrors.EMAIL_EXISTED = {
  code: 5,
  msg: "User's email already exsited"
};
ApiErrors.FACEBOOKID_REQUIRED = {
  code: 6,
  msg: "uuid facebook is required"
};
ApiErrors.INVALID_ACCOUNT_TYPE = {
  code: 7,
  msg: "Invalid account_type"
};
//show user
ApiErrors.MISSING_ID = {
  code: 9,
  msg: "Missing parameter 'id'"
};

ApiErrors.INVALID_ID = {
  code: 10,
  msg: "parameter 'id' is invalid"
};
//put
ApiErrors.NOT_FOUND_RESOURCE = {
  code: 11,
  msg: "Not found resource"
};
/*--- End User ---*/

/*---  Authenticate ---*/
//post
ApiErrors.ACCOUNT_NOT_FOUND_REQ = {
  code: 8,
  msg: "User account not found in the request"
};
/*--- End Authenticate ---*/
/*--- Product ---*/
//post
ApiErrors.PRODUCTNAME_REQUIRED = {
  code: 12,
  msg: " Product name is required"
};
ApiErrors.PRODUCTCODE_REQUIRED = {
  code: 13,
  msg: "Produce code is required"
};
ApiErrors.PRODUCTNAME_CODE_EXISTED = {
  code: 14,
  msg: "Produce name or code already existed"
};

/*--- End Product ---*/

/*--- Tag ---*/
//post
ApiErrors.TAG_NAME_EXISTED = {
  code: 90,
  msg: "Tag name already existed"
};

ApiErrors.TAG_IS_NULL = {
  code: 89,
  msg: "Tag must be not null"
};
/*--- End Tag ---*/

/*--- Classification ---*/
//post
ApiErrors.CLASSIFICATION_NAME_EXISTED = {
  code: 15,
  msg: "Classification name already existed"
};

/*--- End Classification ---*/

/*--- Avatar ---*/
ApiErrors.FILE_TOO_LARGE = {
  code: 16,
  msg: "File too large"
};
ApiErrors.INVALID_FILE_FORMAT = {
  code: 17,
  msg: "Invalid file format"
};
/*--- End Avatar ---*/

/*----Shop ----*/
ApiErrors.SHOPNAME_IS_REQUIRED = {
  code : 88,
  msg  : "Shop name must be not empty"
};

ApiErrors.SHOP_NOT_FOUND = {
  code: 87,
  msg: "Shop not found"
}

ApiErrors.SHOP_ALREADY_EXISTED = {
  code : 86,
  msg  : "Shop already existed"
}
/*----End Shop ----*/

/*---Distributor ---*/
ApiErrors.DISTRIBUTOR_IS_REQUIRED = {
  code :85,
  msg  : "Distributor is required"
}

ApiErrors.DISTRIBUTOR_ALREADY_EXISTED = {
  code : 84,
  msg  : "Distributor already existed"
}

ApiErrors.DISTRIBUTOR_NOT_FOUND = {
  code : 83,
  msg  : "Distributor not found"
}
/*---End Distributor ---*/

// Export messages
module.exports = ApiErrors;

