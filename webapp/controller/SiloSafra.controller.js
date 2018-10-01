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
			var oModel = this.getView().getModel();
		 	var siloData = JSON.parse(this.getView().getModel("silo").getJSON());
		 	var safraData = JSON.parse(this.getView().getModel("safraData").getJSON());
		 	safraData.IDFILIAL = siloData.idFilial;
		 	safraData.IDSILO = siloData.idSilo;
		 	safraData.IDSAFRA = this.getView().byId("safra").getSelectedKey();
		 	/*eslint-disable*/
		 	safraData.IDGRAO = parseInt(this.getView().byId("grao").getSelectedKey());
		 	/*eslint-enable*/
			safraData.DATAINI = this.getView().byId('dataIni').getDateValue();
			safraData.DATAFIM = this.getView().byId('dataFim').getDateValue();
			safraData.DATAENCH = this.getView().byId('dataEnch').getDateValue();
		 	var obs = safraData.OBSERVACAO; 
			delete safraData.OBSERVACAO;
		 	if (Object.values(safraData).some(function (s) {
					return s === undefined || s === "" || s === null;
				})) {
				MessageToast.show("Preencha todos os campos", {
					duration: 3000
				});
				return;
			}
			if(safraData.DATAINI.getDate() >= safraData.DATAFIM.getDate()) {
				MessageToast.show("Data inicial da safra não pode ser maior que a data final", {
					duration: 3000
				});
				return;
			}
			safraData.OBSERVACAO = obs;
		 	jQuery.ajax({
				url: "/ServiceOData/FichaInteligente/SiloSafra/insert.xsjs",
				async: false,
				TYPE: "POST",
				data: {
					dataobject: JSON.stringify(safraData)
				},
				method: "GET",
				dataType: "text",
				success: function (res) {
					MessageToast.show("Sucesso", {
						duration: 3000
					});
					console.log(res);
				},
				error: function (err) {
					MessageToast.show("Erro", {
						duration: 3000
					});
					console.log(err);
				}
			});
			oModel.refresh();
			this.onNavBack();
		 }
	});
});