sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function(Controller, History, MessageToast) {
	"use strict";
	
	return Controller.extend("Belagricola.ficha.controller.AreacaoData", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteAreacaoData").attachPatternMatched(this._onObjectMatched, this);
			sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
			var areacao = new sap.ui.model.json.JSONModel({
				NOME: ""
			});
			var edit = new sap.ui.model.json.JSONModel({isEdit: true});
			this.getView().setModel(edit, 'edit');
			var form = this.byId("form");
			form.setModel(areacao, "areacao");
		},
		_onObjectMatched: function (event) {
			var params = event.getParameter("arguments");
			var form = this.byId("form");
			if (!params["?areacaoPath"]) {
				var areacaoVazio = new sap.ui.model.json.JSONModel({
					NOME: ""
				});
				form.setModel(areacaoVazio, "areacao");
				var edit = new sap.ui.model.json.JSONModel({isEdit: true});
				this.getView().setModel(edit, 'edit');
				return;
			} else {
				var editTrue = new sap.ui.model.json.JSONModel({isEdit: false});
				this.getView().setModel(editTrue, 'edit');
				var areacao = new sap.ui.model.json.JSONModel(params["?areacaoPath"]);
				form.setModel(areacao, "areacao");
			}

		},
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteAreacao", null, true);
			}
		},
		onSave: function (event) {
			var oModel = this.getView().getModel();
			var data = JSON.parse(this.byId("form").getModel("areacao").getJSON());
			//combobox data.IDFILIAL = this.getView().byId("filial").getSelectedKey();
			if (Object.values(data).some(function (s) {
					return s === undefined || s === "" || s === null;
				})) {
				MessageToast.show("Preencha todos os campos", {
					duration: 3000
				});
				return;
			}
			/*eslint-disable*/
			//combobox data.IDFILIAL = parseInt(data.IDFILIAL);
			//combobox data.IDTIPOSILO = parseInt(data.IDTIPOSILO);
			/*eslint-enable*/
			//data.DATA = new Date();
			jQuery.ajax({
				url: "/ServiceOData/FichaInteligente/Areacao/insert.xsjs",
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
					//console.log(res);
				},
				error: function (err) {
					MessageToast.show("Erro", {
						duration: 3000
					});
					//console.log(err);
				}
			});
			oModel.refresh();
			this.onNavBack();
		}
	});
}, true);