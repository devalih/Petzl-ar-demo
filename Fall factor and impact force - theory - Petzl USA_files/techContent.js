/**
 * Le controller des categories
 */
petzl.controllers.TechnicalContent = function ()
{
	/**
	 * Cibler ce controller
	 */
	var that = this;
	
	function init(){
	
		$('.technicalMenu').click(function(){
			// Si il était fermé
			($(this).hasClass('closed'))
			// On l'ouvre
			? openSideMenu($(this))
			// Sinon on le ferme
			: closeSideMenu($(this));
		});
		
		// Parcours les menu pour replier tous sauf le premier
		var techContent = $('#techContentName').text();
		var relevantLi = 'li-'+techContent;
		//$('[id="'+relevantLi+'"]').parent().parent().parent().click();
		$('.technicalMenu').each(function(index){
			var innerMenu = $(this).find('.technicalMenuInner');
			innerMenu.attr('data-height', innerMenu.innerHeight());
			
			//$('[id="'+relevantLi+'"]').parent().parent().parent().click();
			//if(index != 0){
				innerMenu.css('height', '0px');
				$(this).addClass('closed');
				$(this).find('.bigArrowBottom').css({rotate : '-90deg'});
			//}
		//$('[id="'+relevantLi+'"]').parent().parent().parent().click();
		});
		$('[id="'+relevantLi+'"]').parent().parent().parent().click();
		
		// On attache la taille au ul
		var list = $('.warningContainer').find('ul');
		list.attr('data-height', list.innerHeight());
		
		// On parcours 
		$('.associatedProduct').each(function(){
			
			// Réduction du texte
			// Récupération du texte
			var text = $(this).find('.productDescription');
			
			dotify(text, 4);
		});
		
		// Handler du click sur un menu fermé
		
		
		// Ferme un technical menu
		function closeSideMenu(technicalMenu){
			// On récupère l'intérieur du menu
			var innerMenu = technicalMenu.find('.technicalMenuInner');
			
			// Et on anime
			innerMenu.stop().animate({
				height : 0
			}, 400);
			 
			// On rotate un menu sur le côté
			technicalMenu.find('.bigArrowBottom').stop().transition({rotate : '-90deg'});
			
			// On toggle la classe closed
			technicalMenu.addClass('closed');
		}
		
		// Ouvre un technicalMenu
		function openSideMenu(technicalMenu){
			// On parcours tous les menus
			$('.technicalMenu').each(function(){
				// Et on ferme ceux qui étaient ouvert
				(!$(this).hasClass('closed') && $(this) != technicalMenu) 
				? closeSideMenu($(this)) : null;
			});
			
			// On récupère l'intérieur du menu
			var innerMenu = technicalMenu.find('.technicalMenuInner');
			
			// Et on anime
			innerMenu.stop().animate({
				height : innerMenu.data('height')+10
			}, 400);
			 
			// On rotate un menu sur le côté
			technicalMenu.find('.bigArrowBottom').stop().transition({rotate : '0deg'});
			
			// On toggle la classe closed
			technicalMenu.removeClass('closed');
		}
		
		// Handler du click sur le warning
		$('.warningContainer').click(function(){
			// On récupère la liste et la taille qu'il faut lui appliquer
			createCookie();

			if ($.cookie("showWarning") == 1){
				openWarning();
				
			}
			else{ 
				closeWarning();
				
			} 
		});

			/*var list = $(this).find('ul');
			var height = (list.hasClass('closed'))
			? list.data('height')
			: 0;
			
			// On anime le contenu
			list.stop().animate({
				height : height
			});
			
			// On toggle la classe
			list.toggleClass('closed');
			
			$('.lessIcon').stop().animate({
				opacity : (	$('.lessIcon').css('opacity') == 0) ? 1 : 0
			}, 300);
			$('.plusIcon').stop().animate({
				opacity : ($('.plusIcon').css('opacity') == 0) ? 1 : 0
			}, 300);
		});*/

    // Instanciation et init des onglets Advices
		var adviceTabs = new AdviceTab();
		adviceTabs.init();
	}
	
	function dotify(element, lines){
    	// Réduction du texte
		// Line height du text
		var lineHeight = parseInt(element.css('line-height'), 10);
		if(isNaN(lineHeight)){
			
	
		}
		// Hauteur de la div
		var divHeight = element.height();
		// Nombre de lignes résultant
		var nbLines = divHeight / lineHeight;
			
		// Heiht à fixer
		var fixedHeight = lines * lineHeight;
		// On dotdotdot
		element.css('height', fixedHeight);
		element.dotdotdot({
			ellipsis : '...',
			wrap : 'word', 
			height: fixedHeight+'px',
		});
    	
    }


	function createCookie(){
		var value = $.cookie("showWarning");
		var newVal = 1;
		if (value == 1){
			newVal = 0;
		}
		$.cookie("showWarning", newVal, {expires: 30, path: '/'});
	}

	function toggleWarning(){
				if(!$.cookie("showWarning")){
					$.cookie("showWarning", 1, {expires: 30, path: '/'});
				}
					
				else if ($.cookie("showWarning") == 0 ){		//minimize warning
					closeWarning();
				}
				else{
					openWarning();
				}
	}
	
	function closeWarning(){
				$('.warningContainer > ul').addClass('closed');
				$('.warningContainer > ul').stop().animate({ height : '0px' });
				if(	$('.plusIcon').css('opacity') == 0){
					$('.lessIcon').animate({	opacity : 0 }, 300); 
					$('.plusIcon').animate({	opacity : 1 }, 300); 
				}
				
	}
	
	function openWarning(){
				$('.warningContainer > ul').removeClass('closed');
				//var list = $(this).find('ul');
				var he = $('.warningContainer  ul').attr('data-height');
				$('.warningContainer > ul').stop().animate({ height : he });
				if(	$('.lessIcon').css('opacity') == 0){
					$('.lessIcon').animate({	opacity : 1 }, 300); 
					$('.plusIcon').animate({	opacity : 0 }, 300); 
				}
					
	}
	

	/**
	 * Initialisation
	 */

	toggleWarning();
	
	init();
	
	
	
};