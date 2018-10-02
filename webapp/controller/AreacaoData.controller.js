/* eslint no-console: 0 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("Belagricola.ficha.controller.AreacaoData", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteAreacaoData").attachPatternMatched(this._onObjectMatched, this);
			sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
			var areacao = new sap.ui.model.json.JSONModel({
				ID: 0,
				IDUSUARIO: 1,
				IDFILIAL: 0,
				IDSILO: 0,
				DATACADASTRO: new Date(),
				DATAOPERACAO: new Date(),
				HRDIA: 0,
				TEMPERATURAAMBIENTE: 0,
				UMIDADERELATIVA: 0,
				OBSERVACAO: ""
			});
			
			var form = this.byId("form");
			form.setModel(areacao, "areacao");
		},
		_onObjectMatched: function (event) {
			var params = event.getParameter("arguments");
			var form = this.byId("form");
			if (!params["?areacaoPath"]) {
				var areacaoVazio = new sap.ui.model.json.JSONModel({
					ID: "",
					IDUSUARIO: "",
					IDFILIAL: "",
					IDSILO: "",
					DATACADASTRO: new Date(),
					DATAOPERACAO: new Date(),
					HRDIA: "",
					TEMPERATURAAMBIENTE: "",
					UMIDADERELATIVA: "",
					OBSERVACAO: ""
				});
				form.setModel(areacaoVazio, "areacao");
			} else {
				params["?areacaoPath"].DATAOPERACAO = new Date(params["?areacaoPath"].DATAOPERACAO);
				params["?areacaoPath"].DATACADASTRO = new Date(params["?areacaoPath"].DATACADASTRO);
				var areacao = new sap.ui.model.json.JSONModel(params["?areacaoPath"]);
				form.setModel(areacao, "areacao");
			}
		},
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteAreacao", null, true);
			}
		},
		onSave: function (event) {
			var data = JSON.parse(this.byId("form").getModel("areacao").getJSON());
			if (!data.DATAOPERACAO || !data.HRDIA || !data.TEMPERATURAAMBIENTE || !data.UMIDADERELATIVA) {
	        	MessageToast.show("Preencha todos os campos obrigatórios.", { duration: 3000 });
	        	return;
	        }/*eslint-disable*/
			data.ID = parseInt(data.ID);
			data.IDFILIAL = parseInt(this.getView().byId("filial").getSelectedKey());
			data.IDSILO = parseInt(data.IDSILO);
			console.log(data.ID);
			jQuery.ajax({
				url: data.ID !== NaN ? "/ServiceOData/FichaInteligente/Areacao/update.xsjs" : "/ServiceOData/FichaInteligente/Areacao/insert.xsjs",
				async: false,
				TYPE: "POST",
				data: { dataobject: JSON.stringify(data) },
				method: "GET",
				dataType: "text",
				success: function (res) {
					MessageToast.show("Sucesso", { duration: 3000 });
					console.log(res)
				},
				error: function (err) {
					MessageToast.show("Erro", { duration: 3000 });
				}
			});
			this.getView().getModel().refresh();
			this.onNavBack();
		}
	});
}, true);