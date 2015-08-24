
var ApiErrors = function () { };

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

/*--- End User ---*/

/*---  Authenticate ---*/
//post
ApiErrors.ACCOUNT_NOT_FOUND_REQ = {
	code: 8,
	msg: "User account not found in the request"
};
/*--- End Authenticate ---*/

// Export messages
module.exports = ApiErrors;

