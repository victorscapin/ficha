sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("Belagricola.Ficha.controller.View1", {

		onInit: function () {

		},

		onToRouteSilo: function () {
			this.getOwnerComponent().getRouter().navTo("RouteSilo");
		}
	});
}, /* bExport= */ true);