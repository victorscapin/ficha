/* eslint no-console: 0 */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, History, Filter, FilterOperator, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("Belagricola.Ficha.controller.Silo", {

		onInit: function () {
			this.getView().setModel(new sap.ui.model.json.JSONModel({
				isSelected: false
			}), "selected");
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
			var me = this;
			
			MessageBox.show("Deseja remover esse item?", {
        		icon: MessageBox.Icon.WARNING,
        		title: "REMOVER",
        		actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        		onClose : function(sButton) {
			        if (sButton === MessageBox.Action.YES) {
			            var aItems = me.getView().byId("grdSilo").getItems();
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
								MessageToast.show("Item removido!", { duration: 3000 });
							},
							error: function (err) {
								MessageToast.show("Erro: " + err, { duration: 3000 });
							}
						});

						me.getView().getModel().refresh();
			        }
        		}
			});
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
			this.getView().setModel(new sap.ui.model.json.JSONModel({
				isSelected: true
			}), "selected");
		}

	});
}, /* bExport= */ true);