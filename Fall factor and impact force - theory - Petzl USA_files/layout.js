$(document).ready(function(){
	
	
	layout.init();
	
	layout.submenu();
	
	layout.search();
	
	layout.selectLanguage();

	layout.cookie();
	
	if($('input, textarea').length && !$('div#global').hasClass('homepage')){
		$('input, textarea').placeholder();
	}
	
	layout.listener();
	
	layout.blackMenuFix();

    layout.initTooltips($('[data-petzl-tooltip]'));
	
});

var menu = $('#headerBottom');

var offsetMenu = menu.offset();

var submenu = $('.submenuContainer');

var headerHeight = $('header').innerHeight();

var AddNewToCart ; 
	
	
var layout = {
		
	init : function(){	
		
		// On remonte les sous menu, -10 pour cacher le box shadow
		$('.submenuContainer .submenu').css({
			'top' : $('.submenuContainer .submenu').height()*-1-10,
			'display' : 'block'
		});
		
		// On cache les contenus
		$('.submenuContainer .submenu .submenuContent').css({
			opacity :0,
			display : 'none'
		});
		
		// On parcours tous les éléments copyright
		$('.copyrightContent').each(function(){
			// On récupère les tailless
			var padding = $(this).css('padding-top')+' '+$(this).css('padding-right')+' '+$(this).css('padding-bottom')+' '+$(this).css('padding-sososos');
			$(this).attr('data-width', $(this).find('p').width()); 
			$(this).attr('data-padding', padding); 

			// On cache les éléments copyright
			$(this).css('width','32px');
			$(this).css('padding','0px');
			$(this).css('opacity','0');
		});
		
		// Mettre à jour l'offset du menu et des blocks lorsque la hauteur du body change
		$('body').on('heightChange', layout.updatePosition);
		
		layout.updatePosition();

		if(navigator.userAgent.match(/iPad/i) != null){
			$('.searchSubmenuContainer_close ').css('right', '20px');
		}

		$('.popinCart .productName').each(function(){
			dotify($(this), 2);
		});
	},
	
	updatePosition : function(){
		offsetMenu = menu.offset();
	},
	
	// HK: 20/06/2017
	listener : function(checkboxSelector, initCheckboxLabels){
		
		// Listener des checkbox
		checkboxSelector = checkboxSelector || 'input[type=checkbox]';

		if($(checkboxSelector).length){

            function check(checkbox){
                var newOpacity = checkbox.css('opacity') == 0 ? 1 : 0;
                checkbox.animate({
                    opacity : newOpacity
                }, 200);

                var checkboxInput = checkbox.parent().find('input');
                var check = (newOpacity == 1) ? false : true;
                checkboxInput.prop('checked', check).change();
            }

			// HK: 20/06/2017
			$(checkboxSelector).closest('.checkbox').find('label')
				.off('click.checkboxes')
				.on('click.checkboxes', function(){
					var checkbox = $(this).parent().find('.fakeCheckbox');
					check(checkbox);
			});

			if (initCheckboxLabels){
				return;
			}

			
			 $(checkboxSelector).each(function(){
				 $(this).parent().find('.fakeCheckbox').addClass('ieCompatibility');
				 if (navigator.appName == 'Microsoft Internet Explorer')
				 {
					 $(this).css('margin-top', '0px');
				 }

                 // Si elle sont déjà cochées, on met à jour l'affichage.
                 if(this.checked) {
                     var checkbox = $(this).parent().find('.fakeCheckbox');
                     check(checkbox);
                 }

			});
			 

			$('.ieCompatibility').click(function(){
				check($(this));
			});
			

		}
		
		// Hover sur un social button qui contient plusieurs options
		$('div.twoChoicesButton').hover(function(){
			$(this).stop().animate({
				height : 70
			}, 200, function(){
				$(this).find('.socialOptions').stop().css('display','block').animate({
					opacity : 1
				},200);
			});
		}, function(){
			$(this).stop().animate({
				height : 40
			}, 200, function(){
				$(this).find('.socialOptions').animate({
					opacity : 0
				},200, function(){
					$(this).css('display','block');
				});
			});
		});
		
		// Click sur un élément copyright
		$('.pictoPhoto').click(function(){
			// On récupère la taille selon si c'est ouvert ou fermé
			var width = $(this).hasClass('opened') ? 32 : $(this).parent().find('.copyrightContent').data('width');
			var padding = $(this).hasClass('opened') ? 0 : $(this).parent().find('.copyrightContent').data('padding');
			var opacity = $(this).hasClass('opened') ? 0 : 1;
			
			// On anime
			$(this).parent().find('.copyrightContent').stop().animate({
				width : width + 10,
				padding : padding,
				opacity  : opacity
			});
			
			// On toggle la classe opened
			$(this).toggleClass('opened');
		});

		// BACK TO THE TOP : Listener sur le bouton back to top
		$('.backToTop a').click(function(event){
			event.stopPropagation();
			event.preventDefault(event);
			$('html, body').stop().animate({scrollTop: '0px'}, 800);

			return false;
		});


		/**
		 * Header Listeners : ECOM Account + cart 
		 */
		
		var popinNotLogged = $('.popinNotLogged');
		var popinLogged = $('.popinLogged');
		var popinCart = $('.popinCart');
		var popinHeaderSubmenu = $('.topMenu .headerSubmenuContainer').find('ul');
		var popinLanguage = $('.langLists');
		var headerPopins = [popinNotLogged, popinLogged, popinCart, popinHeaderSubmenu, popinLanguage];

		//MY 13.07.2015 ->LHS implement it for static, I added Id name LogOrNot that he should be the one that show added id="LogOrNot" . for the layout.js will know whitch pop up to show
		
		var popinAccountToShow =$('#LogOrNot');
		
		
		/*
		
				MY 13.07.2015 in comment -> good only to static site.
		// Quand on clique pour se logger
		$('.loginAction').click(function(event){
			event.preventDefault();

			// On change la prochaine popin à montrer
			popinAccountToShow = popinLogged;

			// On ferme la popin
			closePopin(popinNotLogged, $('.accountContainer'));
		});

		// Quand on clique pour se logger
		$('.logoutAction').click(function(event){
			event.preventDefault();

			// On change la prochaine popin à montrer
			popinAccountToShow = popinNotLogged;

			// On ferme la popin
			closePopin(popinLogged, $('.accountContainer'));
		});*/

		// Au click sur l'icone compte
		$('.accountContainer').hover(function(){
			popinHandler(popinAccountToShow);
		}, function(){
			closePopin(popinAccountToShow);
		});

		$('.cartContainer').hover(function(){
			// Shalom - If cart is empty we don't display the popup
                if($('.cartCount').html()==0)
                    return;
			popinHandler(popinCart);
		}, function(){
			closePopin(popinCart);
		});
		
		//MY ADDED spec: 2.2.2 - 14.07.2015 -when we add new product to cart
		 AddNewToCart = function(){
			var timeCartToDisplay=parseInt($('#CartDDSecondsAfterBuy').text().trim())*1000;
			popinHandler(popinCart);

			setTimeout(function(){
				closePopin(popinCart);
			}, timeCartToDisplay);

		}
		

		$('.headerSubmenuContainer > a').click(function(event){
			event.preventDefault();
		});

		// Listener du  sélecteur de langue dans le footer
		$('.topMenu .headerSubmenuContainer').hover(function(event){
			event.preventDefault();

			popinHandler(popinHeaderSubmenu);
		}, function(){
			closePopin(popinHeaderSubmenu);
		});

		$('.langueSelect').hover(function(){
			popinHandler(popinLanguage);
		}, function(){
			closePopin(popinLanguage);
		});

		function popinHandler(popin){
			var popinClose = popin.hasClass('opened');

			if(!popinClose){
				closeAllPopin(function(event){
				
					openPopin(popin, $(this));
				});
			} 
		}

		function openPopin(popin){
			popin.css('display', 'block').stop().animate({
				opacity : 1
			}, 200);

			popin.addClass('opened');

		}

		function closePopin(popin){

			popin.stop().animate({
				opacity : 0
			}, 200, function(){
				popin.css('display', 'none');
			});

			popin.removeClass('opened');

		}

		function closeAllPopin(callback){

			for(var popin = 0; popin < headerPopins.length; ++popin) //CHANGE MY 13.07.2015	for(popin in headerPopins) to regular from -Michael help... its use function from vfp extensions and make the js fail
			{
				closePopin(headerPopins[popin]);
			}

			if (callback != null)
			{
				callback.apply(null, null);
			}
		}

		// Quand on doit ouvrir le panier avec un timeout
		$('body').on('OPEN_TIMEOUT_CART',function(event, timeoutTime){
			openPopin(popinCart);

			setTimeout(function(){
				closePopin(popinCart);
			}, timeoutTime);
		});
	},

	
	 submenu : function(){
		var submenuOpen = false;
		var submenuFullyClosed = true;
		var submenuCloseDebounceId;

		// Le container du submenu
		var submenuContainer = $('.submenuContainer');

		// Le submenu
		var submenuElement = $('.submenu');

		var cookieHeight = 0;
		
		function cancelClose ()
		{
			window.clearTimeout(submenuCloseDebounceId);
		}

		// HK Suppot-00010 Fixed bug of site menu
		//$('.submenu').css({ translate: [0, -submenuElement.height()], display : 'block' });
		$('.submenu').css({display : 'block' });

		$(window).scroll(function(){
			if(!$('#headerBottom').parent().hasClass('fixed') && submenuOpen){
				$('.submenuContainer').css({
					'position' :  'absolute'
				});
			}else if($('#headerBottom').parent().hasClass('fixed') && submenuOpen){
				$('.submenuContainer').css({
					'position' :  'fixed',
					'top' : '40px'
				});


			}
		});
		
		// Hover sur un élément du menu qui déroule un sous menu
		$('#headerBottom .mainMenu li a').hover(function(){
			//Récupération de l'id du submenu
			var submenuId = $(this).data('id');
			if(submenuId){
				// Récupération de l'élément DOM du submenu lié
				var submenu  = $('.submenuContainer .submenu #submenu_'+submenuId); 
				if(!submenuOpen && submenuFullyClosed){
					// Si le menu n'est pas ouvert on a juste à ouvrir le sous menu ainsi que le contenu
					_openSubmenu(_showContent, [submenu]);	
				} else if(!submenuOpen && !submenuFullyClosed){
						// Si le menu est déjà ouvert on cache le précédent contenu et on affiche le nouveau
						_openSubmenu(_hideContent(_showContent, [submenu]));
				} else if(submenuOpen){
					if(submenu.attr('id') != $('.submenuContent.open').attr('id')){
						// Si le menu est déjà ouvert on cache le précédent contenu et on affiche le nouveau
						_hideContent(_showContent, [submenu]);
					}
				}
			}
			cancelClose();
		// Callback du  hover 
		}, function(){
			submenuCloseDebounceId = window.setTimeout(function () {
				_closeSubmenu(_hideContent);
			}, 300);
		});

		
		
		// Gestion de l'ouverture
		$('.submenu').hover(function(){
			submenuOpen = true;
			cancelClose();
		}, function(){
			//Gestion de la sortie de l'hover : On ferme
			submenuCloseDebounceId = window.setTimeout(function () {
				_closeSubmenu(_hideContent);
			}, 300);
		});
		
		// OUVERTURE du sous menu
		function _openSubmenu(pCallback, pParams){
			if(!submenuOpen){
				submenuFullyClosed = false;

				if($('#headerBottom').parent().hasClass('fixed')){
					$('.submenuContainer').css('position', 'fixed');
				}


				// On fait apparaître le fond 
				$('#submenuBackgroundRepeat').css({
					display : 'block'
				}).stop().animate({
					opacity : 1
				},200);	


				

				if($('.cookieToast').length && !$('#headerBottom-sticky-wrapper').hasClass('fixed') && submenuContainer.css('top') != '170px'){
					cookieHeight = $('.cookieToast').innerHeight();
				}

				
					
				// On sort le sous menu
				$('.submenuContainer').css('z-index',4);
				$('.submenu').stop().animate({
					top : 0 + cookieHeight
				}, 200, function () {
					if (pCallback != null)
					{
						pCallback.apply(null, pParams);
					}
				});
				
				submenuOpen = true;

				$('#submenuBackgroundRepeat, #headerTop').click(function(){
					submenuCloseDebounceId = window.setTimeout(function () {
						_closeSubmenu(_hideContent);
					}, 300);
				});

			}
		}
		
		// FERMETURE du sous menu
		function _closeSubmenu(pCallback, pParams){
			if(submenuOpen){
				if(!$('.search').hasClass('opened')){
					// Disparition du fond 
					$('#submenuBackgroundRepeat').stop().animate({
						opacity : 0
					},200, function(){
						$(this).css({
							display : 'none'
						});
					});
					
				}
				
				// On rentre le sous menu
				$('.submenu').stop().animate({
					top : $('.submenu').innerHeight()*-1 -10
				}, 200, function () {
					submenuFullyClosed = true;

					if (pCallback != null)
					{
						pCallback.apply(null, pParams);
					}
					
					$('.submenuContainer').css('z-index', 1);
				});

				submenuOpen = false;

				cookieHeight = 0;
			}
		}
		
		// Apparition du contenu
		function _showContent(submenuContent){

			var cookieHeight = 0;
			if($('.cookieToast').length){
				var cookieHeight = $('.cookieToast').innerHeight();
			}
						
			// On regarde quel taille y faut appliquer
			// Si on a plus de de 8 éléments
			if(submenuContent.find('li').length >8){
				submenuElement.stop().animate({
					height : 325
				});
				submenuContainer.stop().animate({
					height : 335 + cookieHeight
				});
			} else{
				// Si y'en a moins
				submenuElement.stop().animate({
					height : 175
				});
				submenuContainer.stop().animate({
					height : 185 + cookieHeight
				});
			}

			$('.submenuContent').stop().css('display', 'none');
			submenuContent.css('display', 'block').animate({
				opacity : 1
			}, 200, function(){
				submenuContent.addClass('open');
			});
		}
		
		//Disparition du contenu
		function _hideContent(pCallback, pParams){
			$('.submenuContent.open').stop().animate({
				opacity : 0
			}, 200, function(){ //200
				$('.submenuContent.open').css('display', 'none');
				$('.submenuContent.open').removeClass('open');
				
				if (pCallback != null)
				{
					pCallback.apply(null, pParams);
				}
			});
		}
		
	},

	search : function(){
		// Event sur le champ de recherche
		/*$('#searchInput').focus(function(){
			$(this).stop().animate({
				width : ($(this).data('width') != undefined) ? $(this).data('width') : '215px'
			}, 300);
		}).blur(function(){
			$(this).stop().animate({
				width : '90px'
			}, 400);
		});*/

		//var headerHeight = $('header').innerHeight();

		// On remonte le menu de recherche
		$('.searchSubmenuContainer').css({
			'top' : -headerHeight -10,
			'display' : 'block'
		});

		$('.searchInput').placeholder();


		
		$(window).scroll(function(){
			if(!$('#headerBottom').parent().hasClass('fixed') && $('.search').hasClass('opened')){
				$('.searchSubmenuContainer').css({
					'position' :  'absolute',
					'top' : headerHeight
				});
			}else if($('#headerBottom').parent().hasClass('fixed') && $('.search').hasClass('opened')){
				$('.searchSubmenuContainer').css({
					'position' :  'fixed',
					'top' : '40px'
				});
			}
		});

		
		// Au click sur le champ de recherche
		$('.search').click(function(){


			if(!$('.search').hasClass('opened')){


				if($('#headerBottom').parent().hasClass('fixed')){
					$('.searchSubmenuContainer').css('position','fixed');
				}

				// On sort le champ
				$('.searchSubmenuContainer').animate({
					'top' : ($('#headerBottom').parent().hasClass('fixed')) ? '40px' : headerHeight
				});

				// On fait apparaître le fond 
				$('#submenuBackgroundRepeat').css({
					display : 'block'
				}).stop().animate({
					opacity : 1
				},200);	

				$('.search').addClass('opened');

				$('#submenuBackgroundRepeat').click(function(){ 
					closeSearchSubmenu();					
				});
				
				// On ajoute le focus
				$('#searchInputGeneral').focus();

			}else{
				closeSearchSubmenu();

				// On vire le focus
				$('#searchInputGeneral').blur();					
			}
		});

		// Au click sur la croix pour fermer
		$('.searchSubmenuContainer_close').click(function(){
			closeSearchSubmenu();
		});

		function closeSearchSubmenu(){
			// On remonte le champ de recherche
			$('.searchSubmenuContainer').animate({
				'top' : -headerHeight -10
			});

			// Disparition du fond 
			$('#submenuBackgroundRepeat').stop().animate({
				opacity : 0
			},200, function(){
				$(this).css({
					display : 'none'
				});
			});
			$('.search').removeClass('opened');
		}
		
	},
	
	selectLanguage : function()
	{
		// Récupérer la taille de tous les sous-menus
		// Pour l'animation d'ouverture / fermeture
		var sizes = [];
		$('.langueSelect li.country').each(function (i, el) {

			var languages = $(this).find('.languages');

			if(languages.length){
				sizes.push(languages.find("> span > li").length * 18 + 10);
			} else{
				sizes.push(0);
			}
		});

		// Cibler les éléments principaux du menu
		var langMainMenuElements = $('.langueSelect li.country');

		// Actualiser l'animation du sous-menu selon les activation de classe "opened"
		function updateSubMenu ()
		{
			// Reparcourir pour effectuer l'animation sur tous les éléments
			langMainMenuElements.each(function (i, el) {
				// Cibler le scope
				$this = $(this);

				// Parcourir et animer chaque sous-menu selon l'état "opened"
				$this.find(".languages").stop().animate({
					height: $(this).hasClass('opened') ? sizes[i] : "0px",
					marginTop : $(this).hasClass('opened') ? 5 : 0
				}, 300);
			});
		}

		// Parcourir les éléments de menu pour l'interaction
		$('.countryName').click(function (event) {
			// Cibler le scope
			var $this = $(this).parent();

			// Marquer l'élément cliqué comme 'ouvert'
			// Enlever le marquage sur les autres éléments
			langMainMenuElements.each(function (i, el) {
				$(this).toggleClass('opened', this == $this[0] && !$(this).hasClass("opened"));
			});

			// Axtualiser l'état du sous-menu
			updateSubMenu();
		});

		// Listener du  sélecteur de langue dans le footer
		/*$('.langueSelect').hover(function(){
			openSubmenu($(this));

		}, function(){
			closeSubmenu($(this));
		});*/

		$('.langueSelect .hitArea').click(function(){
			if(!$(this).hasClass('opened')){
				openSubmenu($(this).parents('.langueSelect'));

				$(this).addClass('opened');
			} else{
				closeSubmenu($(this).parents('.langueSelect'));

				$(this).removeClass('opened');
			}
		});

		function openSubmenu(langSelect){
			// Afficher
			langSelect.find('.langLists').css('display','block').stop().animate({
				opacity : 1
			}, 200);
		}

		function closeSubmenu(langSelect){
			// Masquer
			langSelect.find('.langLists').stop().animate({
				opacity : 0
			}, 200, function(){
				langSelect.find('.langLists').css('display', 'none');
			});

			// Fermer tous les sous-menus
			langMainMenuElements.removeClass('opened');

			// Actualiser l'animation
			updateSubMenu();
		}
	},

	blackMenuFix : function(){
		if($('#headerBottom').length){

			$('#headerBottom').sticky({topSpacing : 0, className : 'fixed'});

		

			var hasBeenFixed = false;
			window.onscroll = function (event){
				if($('#headerBottom-sticky-wrapper').hasClass('fixed')){
					// Le sous menu se situe à 40px du haut de la page
					$('.submenuContainer').css('top','40px');
					hasBeenFixed = true;
				}else if(hasBeenFixed && !$('#headerBottom-sticky-wrapper').hasClass('fixed')){
					// Le submenu container reprend sa place d'origine
					var top = $('header').height();
					var scrollPosition = $(document).scrollTop();
					var headerOffset = $('#headerBottom').offset().top;
					$('.submenuContainer').css('top', headerOffset-scrollPosition + 40);
				}
			};
		}
	},

	cookie : function(){
		// Au click sur le bouton pour fermer le toast cookie
		$('.cookieToast-close').click(function(){
			$('.cookieToast').animate({
				'height' : 0
			}, function(){

				// Quand c'est fini on le remove
				$(this).remove();

				// On update la taille du header
				headerHeight = $('header').innerHeight();

				$('.submenuContainer').css('top', '130px');
			});


			// On update le top du search container

			var topSearch = parseInt($('.searchSubmenuContainer').css('top').replace('px', ''), 10);
			$('.searchSubmenuContainer').animate({
				'top' :  topSearch - 40
			});

		});
	},

    initTooltips : function($elements) {

        $elements.each(function(position, element) {
            var $element = $(element);
            var $content = $element.find('[data-petzl-tooltip-content]');
            //var $originParent = $element.parents('.modalScrollContainer');
            var content = $content.html();


            //var bodyOffset = Number($('body').css('margin-top').replace('px','')) * -1 || 0;
            //var isInPopin = $originParent.length && $originParent.length > 0;

            $element.tooltipster({
                content: content,
                position: 'right',
                contentAsHTML: $content.length > 0 ? true : false,
                delay: 0,
                speed: 200/*,
                offsetY: isInPopin ? 2 : 2 + bodyOffset,
                functionReady: function($origin, $tooltip) {

                    // Si oui, déplacer la tooltip dans la popin

                    if(isInPopin) {
                        $tooltip.detach();
                        $tooltip.appendTo($originParent);
                        $tooltip.css('position', 'fixed');
                        return;
                    }

                }*/
            });
        });

    }
};

function getNbLines(element){
	var height = element.height();
	var lineHeight = parseInt(element.css('line-height'), 10);
	return height / lineHeight;
}

function dotify(element, lines){
	// Réduction du texte
	// Line height du text
	var lineHeight = parseInt(element.css('line-height'), 10);
	if(isNaN(lineHeight)){
		console.log('Line-height non fixé');
	}

	// Si c'est un élément de la popinCart on vire le display none
	if(element.parents().find('.popinCart').length = 1) {
		$('.popinCart').css({
			display: 'block',
			visibility: 'hidden'
		});
	}

	// Hauteur de la div
	var divHeight = element.height();
	// Nombre de lignes résultant
	var nbLines = getNbLines(element);

	if(nbLines <= lines) {
		// Si c'est un élément de la popinCart on rétablie les valeurs initiales
		if(element.parents().find('.popinCart').length = 1) {
			$('.popinCart').css({
				display: 'none',
				visibility: 'visible'
			});
		}
		return;
	}

	// Heiht à fixer
	var fixedHeight = lines * lineHeight;
	// On dotdotdot
	element.css({
		'height': fixedHeight,
		'overflow': 'hidden'
	});
	element.dotdotdot({
		ellipsis : '...',
		wrap : 'word',
		height: fixedHeight+'px',
	});

	// Si c'est un élément de la popinCart on rétablie les valeurs initiales
	if(element.parents().find('.popinCart').length = 1) {
		$('.popinCart').css({
			display: 'none',
			visibility: 'visible'
		});
	}
}