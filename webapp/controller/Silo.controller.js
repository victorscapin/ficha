/* eslint no-console: 0 */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast"
], function (Controller, History, Filter, FilterOperator, MessageToast) {
	"use strict";

	return Controller.extend("Belagricola.Ficha.controller.Silo", {

		onInit: function () {
			var ids = [];
			var context = this;
			new sap.ui.model.odata.ODataModel("/ServiceOData/FichaInteligente/ODataService.xsodata/").read('/SILOSAFRADATA', null, null, true,
				function (oData, response) {
					if (response.statusCode !== 200)
						return;
					ids = oData.results.map(function (m) {
						return m.IDSILO;
					});
					context.getView().setModel(ids, "silosVinculados");
					context.getView().setModel(new sap.ui.model.json.JSONModel({
						isSelected: false,
						isVinc: function () {
							return "oi";
							// console.log(id);
							// return context.getView().getModel("silosVinculados").some(function (s) {
							// 	return id === s;
							// });
						}
					}), "selected");
				});
		},

		_onPageNavButtonPress: function () {

			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteView1", null, true);
			}
		},

		onSearch: function (event) {
			var filtro = [];
			var param = event.getParameter("query");
			if (param) {
				filtro.push(new Filter("NOME", FilterOperator.Contains, param));
			}
			var table = this.byId("grdSilo");
			var bind = table.getBinding("items");
			bind.filter(filtro);
		},

		onNewPress: function () {
			this.getOwnerComponent().getRouter().navTo("RouteSiloData");
		},

		clicaSilo: function (evt) {
			var item = evt.getSource();
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			var data = item.getBindingContext().getObject();
			router.navTo("RouteSiloData", {
				siloPath: {
					NOME: data.NOME,
					ID: data.ID,
					IDFILIAL: data.IDFILIAL,
					NUMEROCABOS: data.NUMEROCABOS,
					POTENCIA: data.POTENCIA,
					CAPACIDADE: data.CAPACIDADE,
					DESCRICAO: data.DESCRICAO,
					REMOVIDO: data.REMOVIDO
				}
			});
		},

		onDeletePress: function () {
			var aItems = this.getView().byId("grdSilo").getItems();
			var aSelectedItems = [];
			for (var i = 0; i < aItems.length; i++) {
				if (aItems[i].getSelected())
					aSelectedItems.push(aItems[i].getBindingContext().getObject().ID);
			}

			var dataValue = JSON.stringify(aSelectedItems.toString());
			jQuery.ajax({
				url: "/ServiceOData/FichaInteligente/Silo/delete.xsjs",
				async: false,
				TYPE: "POST",
				data: {
					lstIds: dataValue
				},
				method: "GET",
				dataType: "text",
				success: function (res) {
					MessageToast.show("Success", {
						duration: 3000
					});
				},
				error: function (err) {
					MessageToast.show("Erro", {
						duration: 3000
					});
				}
			});

			this.getView().getModel().refresh();
		},

		onVincular: function () {
			var grid = this.getView().byId("grdSilo");
			this.getOwnerComponent().getRouter().navTo("RouteSiloSafra", {
				siloSelecionado: JSON.stringify({
					idSilo: grid.getSelectedItem().getBindingContext().getObject().ID,
					idFilial: grid.getSelectedItem().getBindingContext().getObject().IDFILIAL
				})
			});
		},
		onSeleciona: function (evt) {

			var podeVincular = this.getView().getModel("silosVinculados").some(function (s) {
				return evt.getSource().getSelectedItem().getBindingContext().getObject().ID === s;
			});
			this.getView().setModel(new sap.ui.model.json.JSONModel({
				isSelected: podeVincular
			}), "selected");
		}

	});
}, /* bExport= */ true);