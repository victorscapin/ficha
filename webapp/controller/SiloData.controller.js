/*
	eslint no-console: 0
*/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function(Controller, History, MessageToast) {
	"use strict";
	
	return Controller.extend("Belagricola.ficha.controller.SiloData", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteSiloData").attachPatternMatched(this._onObjectMatched, this);
			sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
			var silo = new sap.ui.model.json.JSONModel({
				NOME: "",
				IDTIPOSILO: "",
				IDFILIAL: "",
				CAPACIDADE: "",
				POTENCIA: "",
				NUMEROCABOS: "",
				DESCRICAO: ""
			});
			var edit = new sap.ui.model.json.JSONModel({isEdit: true});
			this.getView().setModel(edit, 'edit');
			var form = this.byId("form");
			form.setModel(silo, "silo");
		},
		_onObjectMatched: function (event) {
			var params = event.getParameter("arguments");
			var form = this.byId("form");
			if (!params["?siloPath"]) {
				var siloVazio = new sap.ui.model.json.JSONModel({
					NOME: "",
					IDFILIAL: "",
					IDTIPOSILO: "",
					CAPACIDADE: "",
					POTENCIA: "",
					NUMEROCABOS: "",
					DESCRICAO: ""
				});
				form.setModel(siloVazio, "silo");
				var edit = new sap.ui.model.json.JSONModel({isEdit: true});
				this.getView().setModel(edit, 'edit');
				return;
			} else {
				var editTrue = new sap.ui.model.json.JSONModel({isEdit: false});
				this.getView().setModel(editTrue, 'edit');
				var silo = new sap.ui.model.json.JSONModel(params["?siloPath"]);
				form.setModel(silo, "silo");
			}

		},
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteSilo", null, true);
			}
		},
		onSave: function (event) {
			var oModel = this.getView().getModel();
			var data = JSON.parse(this.byId("form").getModel("silo").getJSON());
			data.IDFILIAL = this.getView().byId("filial").getSelectedKey();
			if (Object.values(data).some(function (s) {
					return s === undefined || s === "" || s === null;
				})) {
				MessageToast.show("Preencha todos os campos", {
					duration: 3000
				});
				return;
			}
			/*eslint-disable*/
			data.IDFILIAL = parseInt(data.IDFILIAL);
			data.IDTIPOSILO = parseInt(data.IDTIPOSILO);
			/*eslint-enable*/
			//data.DATA = new Date();
			jQuery.ajax({
				url: "/ServiceOData/FichaInteligente/Silo/insert.xsjs",
				async: false,
				TYPE: "POST",
				data: {
					dataobject: JSON.stringify(data)
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
}, /* bExport= */ true);