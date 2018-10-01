/*eslint no-console: 0*/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("Belagricola.Ficha.controller.Sondagem", {
		_onPageNavButtonPress : function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteView1", null, true);
			}
		},
		onNewPress: function() {
			this.getOwnerComponent().getRouter().navTo("RouteSondagemData", null, true);
		}
	});
});