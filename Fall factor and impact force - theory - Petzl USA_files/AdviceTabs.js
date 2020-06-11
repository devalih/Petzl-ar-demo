/**
 * Le gestionnaire d'onglets pour les informations techniques
 */
var AdviceTab = function()
{
    // Cibler
    var that = this;

    // Le conteneur
    this.$advices = $('.Advice');

    // Les onglets
    this.$tabs = $('.Advice_tab', this.$advices);

    // Le contenu
    this.$contents = $('.Advice_content', this.$advices);

    // L'index de l'élément selectionné
    this.selectedIndex = null;

    // Verrou pour l'animation
    this.isAnimating = false;

    // ---------- CONSTRUCTOR -----------
    this.init = function(){

        // On attend que toutes les images soient chargées
        $(window).load(function(){
            // Parcours des contenus
            that.$contents.each(function(index, element){
                // Stocker le height
                var height = $(element).outerHeight(true);
                $(element).attr('data-height', height);

                // Masquer le contenu
                $(element).css('height', '0px');
                $(element).css('display', 'none');
            });

            // Parcours des blocs d'onglets
            that.$advices.each(function(index, element){
                // On définit le width des onglets fermés comme max-width
                var maxWidth = $(element).outerWidth(true) + 1;
                $(element).css("max-width", maxWidth);
            });

            // On lance l'écoute du clic sur un onglet
            tabListener();
        });
    };

    // -------- PRIVATE METHODS ---------

    /**
     * Ecoute du clic sur un onglet
     */
    function tabListener(){
        // Au clic sur un onglet
        if(!that.isAnimating){
            that.$tabs.on(
                'click',
                tabClickHandler.bind(this)
            );
        }
    }


    /**
     * Handler du clic sur un onglet
     * @param pEvent
     */
    function tabClickHandler(pEvent){

        // Si une animation n'est pas en cours
        if(!that.isAnimating){

            // Cibler l'élément
            var $target = $(pEvent.currentTarget);

            // Cibler l'index
            that.selectedIndex = $target.data().tabIndex;

            // Mise à jour de l'état
            updateState();
        }
    }


    /**
     * Gère le changement d'état ouvert/fermé
     */
    function updateState() {
        // Pour chaque onglet
        that.$tabs.each(function(index, element){
            var $currentTab = $(element);
            var $currentContent = that.$contents.eq(index);
            var selectedCondition = (index == that.selectedIndex);

            selectedCondition ? $currentTab.toggleClass('Advice_tab-opened') : $currentTab.removeClass('Advice_tab-opened');

            if(selectedCondition){
                $currentContent.toggleClass('Advice_content-opened');
                animateContent($currentContent, 400);
            }
            else{
                if($currentContent.hasClass('Advice_content-opened')){
                    $currentContent.removeClass('Advice_content-opened');
                    animateContent($currentContent, 400);
                }
            }
        });
    }


    /**
     * Gère l'animation
     * @param pElement
     * @param pDuration
     */
    function animateContent(pElement, pDuration){
        // On verrouille
        that.isAnimating = true;

        if(pElement.hasClass('Advice_content-opened')){


            // Afficher le contenu
            pElement.show();

            // Animer le height
            pElement.stop().animate({
                height : pElement.data('height'),
                padding: '20px 14px',
                opacity: 1
            }, pDuration, 'swing', function(){
                that.isAnimating = false;
            });
        }
        else{
            // Animer le height
            pElement.stop().animate({
                height : 0,
                padding: '0 14px',
                opacity: 0
            }, pDuration, 'swing', function(){
                that.isAnimating = false;
            });
            // Masquer complètement le contenu
            pElement.hide(0);
        }
    }

};