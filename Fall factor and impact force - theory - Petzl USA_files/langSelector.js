/*update by Efraim in 21.12.14*/
petzl.controllers.LangSelector = function()
{
		var language = '';
		var refreshPage = function (c)
		{
					var num = Math.floor(Math.random()*9999);
					var sitedomain = $("#sitedomain_b2c").attr("href");
					var redirectUrl = window.location.href;

					if (language)
					{
						var translatedUrl = $("#langandlocal ."+language).html();
						var translatedUrlWithCountry;
						if(translatedUrl === undefined || translatedUrl === null)
						{
							// HK: 22/03/2017
							translatedUrlWithCountry = $('link[rel="alternate"][hreflang="' + language + (c == 'INT' ? '' : '-' + c) + '"]').attr('href');
							if(translatedUrlWithCountry) 
							{
								  // Fixed bug of language switch on Safari
								  redirectUrl = translatedUrlWithCountry;
							}
							else
							{
								//var allAvailableHREFLANG = Array.from(document.querySelectorAll('link[rel="alternate"]')).map(a=>a.getAttribute('hreflang'));
								//var hreflangForINTLanguage = allAvailableHREFLANG.filter(function(value){return value.indexOf(language) >= 0;})[0];
								
								var hreflangForINTLanguage = ''; 
								$('link[rel=alternate]').each(function()
								{ 
									if ($(this).attr('hreflang').indexOf(language) >= 0) 
										hreflangForINTLanguage = $(this).attr('hreflang'); 
								});
								
								translatedUrl = $('link[rel="alternate"][hreflang="'+hreflangForINTLanguage+'"]').attr('href');
								if(translatedUrl)
								{
									var countryCode = hreflangForINTLanguage.split('-')[1].toUpperCase();
									translatedUrl = translatedUrl.replace(countryCode , "INT");
									redirectUrl = sitedomain + translatedUrl;
								}
							}
							
							if(!translatedUrl && !translatedUrlWithCountry)
							{
								redirectUrl = sitedomain;
							}
						}
						
						if (translatedUrl && (translatedUrlWithCountry === undefined || translatedUrlWithCountry === null))
						{
							/*replace url with updated language setting*/
							if(translatedUrl.indexOf('/' + c) >= 0){
								redirectUrl = sitedomain + translatedUrl;
							}
							else 
							{
								redirectUrl = sitedomain + '/' + c + translatedUrl;
							}
						}
						else if((translatedUrl === undefined || translatedUrl === null) 
								&& (translatedUrlWithCountry === undefined || translatedUrl === null)) {
							redirectUrl = sitedomain + '?upd=' +num;
						}
						
					}
					else 
					{
						redirectUrl = '/' + '?upd=' +num;
					}

					window.location.href = redirectUrl;
		}

					   
		var updateCookie = function(country, lang){ 
					var date = new Date();
					date.setTime(date.getTime()+(365*10*24*60*60*1000));   //set expire 10 years
					if(country){
							document.cookie = 'apex__country='+country + ';' + 'path=/; expires=' +date.toGMTString(); +';'
					}
					if(lang){
							document.cookie = 'apex__language='+lang + ';' + 'path=/;  expires=' +date.toGMTString(); +';' 
							language = lang;
					}
					//AEF: 25/08/2015
					//Web_Template.redirectToHome(refreshPage(country));    //remote action, callback to refreshPage
					refreshPage(country);
		}
		
		$('.countryLang').click(function() {
				var countryCode = $(this).attr("data-country-code");
				var lanCode = $(this).attr("data-lang-code");
				updateCookie(countryCode,lanCode);
		});
		/**
		 *  AEF: 25/08/2015
		 */
		function refreshPage_for_oldUrlPattren(c) {
					var num = Math.floor(Math.random()*9999);
					
					if (language){
						var translatedUrl = $("#langandlocal ."+language).html();
						if(translatedUrl === undefined || translatedUrl === null)
							 translatedUrl = $('link[rel="alternate"][hreflang="'+language+'"]').attr('href');
						
						
						if (translatedUrl){
							
							/*AEF: 18.12.2014, Search in path language setting like ?l=EN or &l=EN */
							var exp = /[&|\?]l=?=[A-Z][A-Z]*/gi;
							/*array of seartch result */
							var matches = translatedUrl.match(exp);

							if(matches && matches.length > 0) {
								/*replace language setting */
								for(var s = 0; s < matches.length; s++) 
									translatedUrl = translatedUrl.replace(matches[s].substring(1), "l="+c);
							}
							else if(translatedUrl.indexOf("?") >= 0){
								/*set language if not exit, but exist other params*/
								translatedUrl += "&l="+c;
							} 
							else {
								/*set language*/
								translatedUrl += "?l="+c;
							}
							/*console.log('translatedUrl = ' + translatedUrl);*/
							/*replace url with updated language setting*/
							window.location.href = translatedUrl;
						}
						else {
							window.location.href= '/' + '?upd=' +num;
						}
						
					}
					else
						window.location.href= '/' + '?upd=' +num;
		}
		
}