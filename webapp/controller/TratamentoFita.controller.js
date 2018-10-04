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

	return Controller.extend("Belagricola.Ficha.controller.TratamentoFita", {

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

		},

		onNewPress: function () {
			this.getOwnerComponent().getRouter().navTo("RouteTratamentoFitaData");
		},

		clicaTratamentoFita: function (evt) {
			var item = evt.getSource();
			var router = sap.ui.core.UIComponent.getRouterFor(this);
			var data = item.getBindingContext().getObject();
			router.navTo("RouteTratamentoFitaData", {
				tratamentoFitaPath: {
					ID: data.ID,
					IDUSUARIO: data.IDUSUARIO,
					IDSILO: data.IDSILO,
					DATACADASTRO: data.DATACADASTRO,
					DATAOPERACAO: data.DATAOPERACAO,
					IDPRODUTOAPLICADO: data.IDPRODUTOAPLICADO,
					QTDEPRODUTO: data.QTDEPRODUTO,
					QTDEGRAOS: data.QTDEGRAOS,
					CONSUMOTOTAL: data.CONSUMOTOTAL,
					TOTALPARCIAL: data.TOTALPARCIAL,
					OBSERVACAO: data.OBSERVACAO,
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
				onClose: function (sButton) {
					if (sButton === MessageBox.Action.YES) {
						var aItems = me.getView().byId("grdTratamentoFita").getItems();
						var aSelectedItems = [];
						for (var i = 0; i < aItems.length; i++) {
							if (aItems[i].getSelected())
								aSelectedItems.push(aItems[i].getBindingContext().getObject().ID);
						}

						var dataValue = JSON.stringify(aSelectedItems.toString());
						jQuery.ajax({
							url: "/ServiceOData/FichaInteligente/TratamentoFita/delete.xsjs",
							async: false,
							TYPE: "POST",
							data: {
								lstIds: dataValue
							},
							method: "GET",
							dataType: "text",
							success: function (res) {
								MessageToast.show("Item removido!", {
									duration: 3000
								});
							},
							error: function (err) {
								MessageToast.show("Erro: " + err, {
									duration: 3000
								});
							}
						});

						me.getView().getModel().refresh();
					}
				}
			});
		},

		onTratamentoFitaSelect: function (evt) {
			var remove = evt.getSource().getSelectedItem().getBindingContext().getObject().REMOVIDO;
			this.getView().setModel(new sap.ui.model.json.JSONModel({
				isSelected: !remove
			}), "selected");
		},

		onPressBreadcrumb: function (event) {
			this.getOwnerComponent().getRouter().navTo(event);
		}
	});
}, true);