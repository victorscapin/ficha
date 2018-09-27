/* eslint no-console: 0 */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("Belagricola.ficha.controller.SiloSafra", {
		onInit: function() {
			var router = sap.ui.core.UIComponent.getRouterfor(this);
			router.getRoute("RouteSiloSafra").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function(evt) {
			this.getView().bindElement({
				path: "/" + evt.getSource().getParameter("arguments").siloSelecionado,
				model: "silo"
			});
		},
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteSilo", null, true);
			}
		},
		 onSave: function() {
		 	console.log(this.getView().getModel("silo"));
		 }
	});
});