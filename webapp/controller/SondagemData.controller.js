/*eslint no-console: 0*/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";
	return Controller.extend("Belagricola.Ficha.controller.SondagemData", {
		onInit: function () {
		},
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteSondagem", null, true);
			}
		},
		onTermSelected: function(evt){
			console.log(evt.getParameters().selected);
		},
		onPadraoSelected: function(evt){
			console.log(evt.getParameters().selected);
		}
	});
});