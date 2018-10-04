/* eslint no-console: 0 */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function (Controller, History, MessageToast) {
	"use strict";

	return Controller.extend("Belagricola.ficha.controller.TratamentoFitaData", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("RouteTratamentoFitaData").attachPatternMatched(this._onObjectMatched, this);
			sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
			var tratamentoFita = new sap.ui.model.json.JSONModel({
				ID: 0,
				IDUSUARIO: 1,
				IDSILO: 0,
				DATACADASTRO: new Date(),
				DATAOPERACAO: new Date(),
				QTDEPRODUTO: 0,
				QTDEGRAOS: 0,
				CONSUMOTOTAL: 0,
				TOTALPARCIAL: 0,
				OBSERVACAO: ""
			});

			var form = this.byId("form");
			form.setModel(tratamentoFita, "tratamentoFita");
		},
		_onObjectMatched: function (event) {
			var params = event.getParameter("arguments");
			var form = this.byId("form");
			if (!params["?tratamentoFitaPath"]) {
				var tratamentoFitaVazio = new sap.ui.model.json.JSONModel({
					ID: "",
					IDUSUARIO: 1,
					IDSILO: "",
					DATACADASTRO: new Date(),
					DATAOPERACAO: new Date(),
					QTDEPRODUTO: "",
					QTDEGRAOS: "",
					CONSUMOTOTAL: "",
					TOTALPARCIAL: "",
					OBSERVACAO: ""
				});
				form.setModel(tratamentoFitaVazio, "tratamentoFita");
			} else {
				var date = new Date(params["?tratamentoFitaPath"].DATAOPERACAO);
				params["?tratamentoFitaPath"].DATAOPERACAO = new Date(date.setDate(date.getDate() + 1));
				params["?tratamentoFitaPath"].DATACADASTRO = new Date();
				var tratamentoFita = new sap.ui.model.json.JSONModel(params["?tratamentoFitaPath"]);
				form.setModel(tratamentoFita, "tratamentoFita");
			}
		},
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RoutetratamentoFita", null, true);
			}
		},
		onSave: function (event) {
			var data = JSON.parse(this.byId("form").getModel("tratamentoFita").getJSON());
			if (!data.DATAOPERACAO  || !data.IDPRODUTOAPLICADO ||  !data.QTDEPRODUTO || !data.QTDEGRAOS || !data.CONSUMOTOTAL || !data.TOTALPARCIAL) {
				MessageToast.show("Preencha todos os campos obrigatórios.", {
					duration: 3000
				});
				return;
			} /*eslint-disable*/
			if (data.ID) data.ID = parseInt(data.ID);
			data.IDUSUARIO = parseInt(data.IDUSUARIO);
			data.IDSILO = parseInt(data.IDSILO);
			data.IDPRODUTOAPLICADO = parseInt(data.IDPRODUTOAPLICADO);
			data.QTDEPRODUTO = parseInt(data.QTDEPRODUTO);
			data.QTDEGRAOS = parseInt(data.QTDEGRAOS);
			data.CONSUMOTOTAL = parseInt(data.CONSUMOTOTAL);
			data.TOTALPARCIAL = parseInt(data.TOTALPARCIAL);
			data.REMOVIDO = parseInt(data.REMOVIDO);

			jQuery.ajax({
				url: data.ID ? "/ServiceOData/FichaInteligente/TratamentoFita/update.xsjs" : "/ServiceOData/FichaInteligente/TratamentoFita/insert.xsjs",
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
					console.log(res)
				},
				error: function (err) {
					MessageToast.show("Erro", {
						duration: 3000
					});
				}
			});
			this.getView().getModel().refresh();
			this.onNavBack();
		},
		onPressBreadcrumb: function (event) {
			this.getOwnerComponent().getRouter().navTo(event);
		}
	});
}, true);