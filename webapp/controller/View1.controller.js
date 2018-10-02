sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("Belagricola.Ficha.controller.View1", {

		onInit: function () {

		},

		onToRouteSilo: function () {
			this.getOwnerComponent().getRouter().navTo("RouteSilo");
		},
		
		onToRouteAreacao: function () {
			this.getOwnerComponent().getRouter().navTo("RouteAreacao");
		}
		
	});
}, /* bExport= */ true);