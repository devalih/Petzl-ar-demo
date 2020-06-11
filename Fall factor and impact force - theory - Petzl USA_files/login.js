/**
 * created: 29/07/2015 by AEF
 * login.js
 */

var loginCTRL =
{
	loginEmailId : '',
	loginPassowrdId : '',
	loginPopupId : '',
	oncompleteAction : null,
	redirectUrl : null,

	loginActionWithOncomplete : function(givenLoginPopupId, givenLoginEmaiId, givenLoginPasswordId, givenOncompleteAction, redirUrl)
	{
		loginCTRL.oncompleteAction = givenOncompleteAction;
		loginCTRL.loginAction(givenLoginPopupId, givenLoginEmaiId, givenLoginPasswordId, redirUrl);
	},

	loginAction : function(givenLoginPopupId, givenLoginEmaiId, givenLoginPasswordId, redirUrl, countryCode) {
		loginCTRL.loginPopupId = givenLoginPopupId;
		loginCTRL.loginEmailId = givenLoginEmaiId;
		loginCTRL.loginPassowrdId = givenLoginPasswordId;
		var $loginPassword = $("#" + loginCTRL.loginPassowrdId);

		var email = $("#" + loginCTRL.loginEmailId).val();
		var pwd   = $loginPassword.val();

		loginCTRL.removeErrorMsg();

		if (!loginCTRL.validateLoginData(email, pwd)) return false;

		B2C_Web_Login_Utils.portalUserLoginWithCountry(
			email, pwd,
			redirUrl || '/',
			$.cookie('apex__OrderId') || '',
			countryCode || 'INT',
			loginCTRL.sessionRedirectHandler,
			{escape: false}
		);
	},

	reloadPage : function()
	{
		if(loginCTRL.oncompleteAction === null)
		{
			var destPage = loginCTRL.destantionPage();
			if (destPage == window.location.href)
				window.location.reload();
			else
				top.location.href = destPage;
		}
		else
		{
			loginCTRL.oncompleteAction(loginCTRL.destantionPage());
		}
	},

	getUrlParam : function(name, url) {
	  if (!url) url = location.href;
	  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	  var regexS = "[\\?&]"+name+"=([^&#]*)";
	  var regex = new RegExp( regexS );
	  var results = regex.exec(url);
	  return results == null ? null : results[1];
	},

	errorHandler : function()
	{
		$("#" + loginCTRL.loginPopupId + " .InputContainer_input").addClass("InputText-error");
		// $("#" + loginCTRL.loginPopupId + " .InputText_errorLabel").html("Bad user name or password");
		$("#" + loginCTRL.loginPopupId + " .InputText_errorLabel").show();
	},

	removeErrorMsg : function()
	{
		$("#" + loginCTRL.loginPopupId + " .InputContainer_input").removeClass("InputText-error");
		// $("#" + loginCTRL.loginPopupId + " .InputText_errorLabel").html("");
		$("#" + loginCTRL.loginPopupId + " .InputText_errorLabel").hide();
	},

	getIT : function(callMe)
	{
		$.ajax({
			url: callMe,
			success: loginCTRL.reloadPage,
			failure: loginCTRL.errorHandler,
			headers: {
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
			},
		});
	},

	sessionRedirectHandler : function (url) {
		loginCTRL.removeErrorMsg();

		if (!url) {
			loginCTRL.errorHandler();
			return;
		}

		loginCTRL.redirectUrl = decodeURIComponent(/[&?]retURL=(.*?)[&$]/.exec(url)[1]);
		loginCTRL.getIT(url);
	},

	validateLoginData : function (email, pwd)
	{
		var emailPattern = /^([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.[a-zA-Z0-9\-]{2,}$/;
		if (!email || !pwd || !emailPattern.test(email))
		{
			loginCTRL.errorHandler();
			return false;
		}
		else
		{
			loginCTRL.removeErrorMsg();
		}
		return true;
	},

	destantionPage : function()
	{
		return	window.location.href.indexOf(b2c_login_label) < 0
				&& window.location.href.indexOf(b2c_checkout_label) < 0
				? window.location.href : loginCTRL.redirectUrl;
	}
}
