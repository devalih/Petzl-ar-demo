/**
 * jQuery Touchr Plugin
 * Ce plugin permet de simuler des MouseEvents avec TouchEvents
 * @name jquery-touchr-1.0.js
 * @author Alexis Bouhet - www.lahautesociete.com
 * @version 1.0
 * @date November 04, 2010
 * @category jQuery plugin
 * @copyright (c) 2010 La Haute Société (www.lahautesociete.com)
 * @license
 * @example
 */
(function($){
	$.fn.touchr = function (pOptions)
	{
		// Parcourir tous les éléments
		return this.each(function(i, that)
		{
			// Les paramètres par défaut
			var options = $.extend({
				// Désactiver le double tap pour que les tap n'aient pas 300ms de délais
				fastTap: true,
				
				// Annuler l'action par défaut du navigateur
				preventDefault: true,
				
				// Dispatcher direct au début du touch
				// Attention, uniquement un "click" sera dispatché sur "touchstart"
				dispatchOnStart: false
			}, pOptions);

			// Si on a bougé pendant un tap
			var moved = false;

			// Convertir un TouchEvent en MouseEvent
			function emulateTouch (event)
			{
				if (options.preventDefault)
				{
					// Pas d'action par défaut (bouger la page par exemple)
					event.preventDefault();
				}

				// Récupérer les pointes
				var touches = event.changedTouches;

				// Le type de l'event
				var type = event.type;

				// Si on doit dispatcher direct
				if (options.dispatchOnStart)
				{
					if (type == "touchstart")
						dispatchMouseEvent("click", touches[0]);
					
					return;
				}
				// Si on doit utiliser les fastTap
				else if (options.fastTap)
				{
					// Vérifier les mouvements pour émuler les clics
					if (type == "touchstart")
						moved = false;
					else if (type == "touchmove")
						moved = true;
					else if (type == "touchend" && !moved)
						dispatchMouseEvent("click", touches[0]);
				}
				
				// Séléctionner le type de MouseEvent selon le TouchEvent
				switch (type) {
					case 'touchtap':
						type = 'click';
						break;
					case 'touchstart':
						type = 'mousedown';
						break;
					case 'touchmove':
						type = 'mousemove';
						break;
					case 'touchend':
						type = 'mouseup';
						break;
					default:
						return;
				};

				// Dispatcher l'équivalent mouseEvent
				dispatchMouseEvent(type, touches[0]);
			}

			function dispatchMouseEvent (pType, pPoint)
			{
				// Créer le MouseEvent
				var simulatedEvent = document.createEvent('MouseEvent');

				// L'initialiser avec les données du touchEvent
				simulatedEvent.initMouseEvent(pType, true, true, window, 1, pPoint.screenX, pPoint.screenY, pPoint.clientX, pPoint.clientY, false, false, false, false, 0, null);

				// Dispatcher
				pPoint.target.dispatchEvent(simulatedEvent);
			}

			// Binder les TouchEvent sur cet élément
			$(that).bind('touchstart touchmove touchend touchcancel', function ()
			{
				// Emuler
				emulateTouch(event);
			});
		});
	};
})(jQuery);