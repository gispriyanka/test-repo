define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/query",
    "dijit/registry",
    "generic/ResourceManager",
    "dojo/text!./HeaderToolBar.infoArea.html",
    "dojox/mobile/Container",
    "dojox/mobile/Badge",
    "dojo/domReady!"
], function(declare, lang, domConstruct, domGeometry, domStyle, query, registry, ResourceManager, infoAreaSnippet, Container, Badge) {

    var leftLogoWidth = 0, rightLogoWidth = 0, areaInfoNode;

    function logoLeftOnLoad(evt) {
        var target = evt.target || evt.srcElement;
        leftLogoWidth = target.width;
        //console.log("logoLeftOnLoad() called");
        this.resize();
    }

    function logoLeftLoadError(evt) {
        var target = evt.target || evt.srcElement;
        domStyle.set(target, "display", "none");
        //console.log("logoLeftLoadError() called");
        this.resize();
    }

    function logoLeftClicked(evt) {
        //console.log("logo left clicked", evt);

        if (!registry.byId('posView').isVisible()) {
            var clickableImage = require("dojo/dom").byId("headingLogoLeft");
            registry.byId(clickableImage.activeView).performTransition("posView", -1, "slidev");
            clickableImage.activeView = "posView";
            //console.log("Current view is now = " + clickableImage.activeView);
        }
    }

    function logoRightOnLoad(evt) {
        var target = evt.target || evt.srcElement;
        rightLogoWidth = target.width;
        //console.log("logoRightOnLoad() called");
        this.resize();
    }

    function logoRightLoadError(evt) {
        var target = evt.target || evt.srcElement;
        domStyle.set(target, "display", "none");
        //console.log("logoRightLoadError() called");
        this.resize();
    }

    return declare([Container], {
        areaInfoNode: undefined,

        buildRendering: function () {
            this.inherited(arguments);

            // add divs for left image / info area / right image

            this.class = "ovcHeaderContainer";
            domStyle.set(
                this.containerNode, {
                    width: "100%",
                    height: "40px",
                    display: "inline-block"
                });

            var clickableImage = domConstruct.create(
                "img",
                {
                    id: 'headingLogoLeft',
                    class: 'headingLogoLeft',
                    src: base + '/../../dynamicblob/posMClient/topleft-logo-200x40.png',
                    onload: lang.hitch(this, logoLeftOnLoad),
                    onerror: lang.hitch(this, logoLeftLoadError),
                    onclick: lang.hitch(this, logoLeftClicked)
                },
                this.containerNode);

            // initialize tracking of the active view for transitions
            clickableImage.activeView = "posView";
            //console.log("Initial view is = " + clickableImage.activeView);

/*---------- start of info area ----------*/
            // add snippet
            areaInfoNode =
                domConstruct.toDom(
                    "<div id='infoArea' class='infoArea'></div>");
            domConstruct.place(infoAreaSnippet, areaInfoNode);
            domConstruct.place(areaInfoNode, this.containerNode);

            // create badge widget and add it
            new Badge({
                className: "mblDomButtonGreenBadge",
                value: "0"
            }, query('.alertBadge', this.containerNode)[0]);

            // update labels with nls strings
            query('.posTx', this.containerNode)[0].innerHTML = ResourceManager.getValue("pos.tx");
            query('.posReg', this.containerNode)[0].innerHTML = ResourceManager.getValue("pos.reg");
            query('.posTill', this.containerNode)[0].innerHTML = ResourceManager.getValue("pos.till");
            query('.posStore', this.containerNode)[0].innerHTML = ResourceManager.getValue("pos.store");
/*---------- end of info area ----------*/

            domConstruct.create(
                "img",
                {
                    id: 'logo-right',
                    class: 'headingLogoRight',
                    src: base + '/../../dynamicblob/posMClient/topright-store-logo.png',
                    onload: lang.hitch(this, logoRightOnLoad),
                    onerror: lang.hitch(this, logoRightLoadError)
                },
                this.containerNode);
        },

        startup: function() {
            this.inherited(arguments);
        },

        resize: function() {
            this.inherited(arguments);

            // adjust width of info area based on images being shown
            var containerNodeGeometry = domGeometry.getMarginBox(this.containerNode);
            var containerNodeWidth = containerNodeGeometry.w;
            //console.log("containerNodeWidth: " + containerNodeWidth);

            var computedStyle = domStyle.getComputedStyle(areaInfoNode);
            var areaInfoNodeGeometry = domGeometry.getMarginBox(areaInfoNode, computedStyle);
            //console.log("infoAreaWidth (before): " + areaInfoNodeGeometry.w);

            // adjust the width
            //console.log("containerNodeWidth: " + containerNodeWidth);
            //console.log("leftLogoWidth: " + leftLogoWidth);
            //console.log("rightLogoWidth: " + rightLogoWidth);
            var calculatedWidth = containerNodeWidth - (leftLogoWidth + rightLogoWidth + 5/*small buffer*/);
            //console.log("calculated width: " + containerNodeWidth);
            domStyle.set(
                areaInfoNode, {
                    width: calculatedWidth + "px"
                });

            computedStyle = domStyle.getComputedStyle(areaInfoNode);
            areaInfoNodeGeometry = domGeometry.getMarginBox(areaInfoNode, computedStyle);
            //console.log("infoAreaWidth (after): " + areaInfoNodeGeometry.w);
        }
    });
});
