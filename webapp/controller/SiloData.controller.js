/* 
	eslint no-console: 0,
	radix: ["error", "as-needed"]
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
				ID: 0,
				NOME: "",
				IDTIPOSILO: 0,
				IDFILIAL: 0,
				CAPACIDADE: 0,
				POTENCIA: 0,
				NUMEROCABOS: 0,
				DESCRICAO: ""
			});
			
			var form = this.byId("form");
			form.setModel(silo, "silo");
		},
		
		_onObjectMatched: function (event) {
			var params = event.getParameter("arguments");
			var form = this.byId("form");
			if (!params["?siloPath"]) {
				var siloVazio = new sap.ui.model.json.JSONModel({
					ID: "",
					NOME: "",
					IDFILIAL: "",
					IDTIPOSILO: "",
					CAPACIDADE: "",
					POTENCIA: "",
					NUMEROCABOS: "",
					DESCRICAO: ""
				});
				form.setModel(siloVazio, "silo");
			} else {
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
			var data = JSON.parse(this.byId("form").getModel("silo").getJSON());
			console.log(data);
			if (!data.NOME || !data.IDFILIAL || !data.IDTIPOSILO || !data.CAPACIDADE || !data.POTENCIA || !data.NUMEROCABOS) {
	        	MessageToast.show("Preencha todos os campos obrigatórios.", { duration: 3000 });
	        	return;
	        }
			data.IDFILIAL = parseInt(this.getView().byId("filial").getSelectedKey());
			data.IDTIPOSILO = parseInt(data.IDTIPOSILO);

			jQuery.ajax({
				url: data.ID ? "/ServiceOData/FichaInteligente/Silo/update.xsjs" : "/ServiceOData/FichaInteligente/Silo/insert.xsjs",
				async: false,
				TYPE: "POST",
				data: { dataobject: JSON.stringify(data) },
				method: "GET",
				dataType: "text",
				success: function (res) {
					MessageToast.show("Salvo com sucesso", { duration: 3000 });
					console.log(res);
				},
				error: function (err) {
					MessageToast.show("Erro: " + err.message, { duration: 3000 });
					console.log(err);
				}
			});
			this.getView().getModel().refresh();
			this.onNavBack();
		}
		
	});
}, /* bExport= */ true);