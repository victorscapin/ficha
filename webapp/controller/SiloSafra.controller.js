/* eslint no-console: 0 */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("Belagricola.ficha.controller.SiloSafra", {
		onInit: function() {
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			router.getRoute("RouteSiloSafra").attachPatternMatched(this._onObjectMatched, this);
			this.getView().setModel(new sap.ui.model.json.JSONModel({
				IDSAFRA: "",
				IDGRAO: "",
				DATAINI: "",
				DATAFIM: "",
				DATAENCH: "",
				OBSERVACAO: ""
			}),"safraData");
		},
		_onObjectMatched: function(evt) {
			console.log( JSON.parse(evt.getParameter("arguments").siloSelecionado));
			this.getView().setModel(new sap.ui.model.json.JSONModel({
				idSilo :JSON.parse(evt.getParameter("arguments").siloSelecionado).idSilo,
				idFilial: JSON.parse(evt.getParameter("arguments").siloSelecionado).idFilial
			}), "silo");
		},
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteSilo", null, true);
			}
		},
		 onSalvar: function() {
		 	var siloData = JSON.parse(this.getView().getModel("silo").getJSON());
		 	var safraData = JSON.parse(this.getView().getModel("safraData").getJSON());
		 	safraData.IDFILIAL = siloData.idFilial;
		 	safraData.IDSILO = siloData.idSilo;
		 	/*eslint-disable*/
		 	safraData.IDSAFRA = parseInt(this.getView().byId("safra").getSelectedKey());
		 	safraData.IDGRAO = parseInt(this.getView().byId("grao").getSelectedKey());
		 	/*eslint-enable*/
		 	if (Object.values(safraData).some(function (s) {
					return s === undefined || s === "" || s === null;
				})) {
				MessageToast.show("Preencha todos os campos", {
					duration: 3000
				});
				return;
			}
		 	console.log(safraData);
		 }
	});
});