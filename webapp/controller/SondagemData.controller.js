/*eslint no-console: 0*/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (Controller, History, JSONModel, MessageToast) {
	"use strict";
	return Controller.extend("Belagricola.Ficha.controller.SondagemData", {
		_termFrag: {},

		_pdrProdFrag: {},

		_sondagem: {
			termo: false,
			padrao: false
		},

		onInit: function () {
			this._termFrag = sap.ui.xmlfragment("term", "Belagricola.Ficha.view.TermometriaForm");
			this._pdrProdFrag = sap.ui.xmlfragment("pdrProd", "Belagricola.Ficha.view.PadraoProdForm");
			this._termFrag.setModel(new JSONModel({
				DATAOP: new Date(),
				TEMPAMB: 0,
				TEMPMAX: 0,
				NGRAUS: 0,
				OBS: ""
			}), "termometria");
			this._pdrProdFrag.setModel(new JSONModel({
				UMIDADE: 0,
				ARDIDO: 0,
				AVARIADO: 0,
				ESVERDEADO: 0,
				IMPUREZA: 0,
				TRIGULHO: 0,
				PH: 0,
				INSETOS: 0,
				CONDENSACAO: 0,
				ODOR: 0,
				OBS: ""
			}), "padrao");
		},
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteSondagem", null, true);
			}
		},
		onTermSelected: function (evt) {
			var element = this.getView().byId("form");
			this._sondagem.termo = evt.getParameters().selected;
			if (evt.getParameters().selected)
				element.insertFormContainer(this._termFrag, 1);
			else
				element.removeFormContainer(this._termFrag);
			// this._termFrag.setModel(new JSONModel({
			// 	termEnabled: evt.getParameters().selected
			// }), "enabled");
		},
		onPadraoSelected: function (evt) {
			this._sondagem.padrao = evt.getParameters().selected;
			var element = this.getView().byId("form");
			if (evt.getParameters().selected)
				element.insertFormContainer(this._pdrProdFrag, 1);
			else
				element.removeFormContainer(this._pdrProdFrag);
		},

		salvaTermo: function (termo, callback) {
			jQuery.ajax({
				url: "/ServiceOData/FichaInteligente/Termometria/insert.xsjs",
				async: false,
				TYPE: "POST",
				data: {
					dataobject: JSON.stringify(termo)
				},
				method: "GET",
				dataType: "text",
				success: function (res) {
					MessageToast.show("Sucesso", {
						duration: 3000
					});
					callback(res);
				},
				error: function (err) {
					MessageToast.show("Erro", {
						duration: 3000
					});
					console.log(err);
				}
			});
		},

		salvaPadrao: function (pad, callback) {
			jQuery.ajax({
				url: "/ServiceOData/FichaInteligente/PadraoProduto/insert.xsjs",
				async: false,
				TYPE: "POST",
				data: {
					dataobject: JSON.stringify(pad)
				},
				method: "GET",
				dataType: "text",
				success: function (res) {
					MessageToast.show("Sucesso", {
						duration: 3000
					});
					callback(res);
				},
				error: function (err) {
					MessageToast.show("Erro", {
						duration: 3000
					});
					console.log(err);
				}
			});
		},

		onSave: function () {
			var termo = JSON.parse(this._termFrag.getModel("termometria").getJSON());
			var pad = JSON.parse(this._pdrProdFrag.getModel("padrao").getJSON());
			if (termo.TEMPAMB === 0 || termo.TEMPMAX === 0 || termo.NGRAUS === 0) {
				MessageToast.show("Preencha os campos obrigatorios !!", {
					duration: 3000
				});
				return;
			}
			if (pad.UMIDADE === 0 || pad.ARDIDO === 0 || pad.AVARIADO === 0 || pad.ESVERDEADO === 0 || pad.IMPUREZA === 0 || pad.TRIGULHO === 0 ||
				pad.PH === 0) {
				MessageToast.show("Preencha os campos obrigatorios !!", {
					duration: 3000
				});
				return;
			}
			if (!this._sondagem.termo && !this._sondagem.padrao) {
				MessageToast.show("Selecione um informativo !!", {
					duration: 3000
				});
				return;
			}
			var idPad;
			var idTer;
			if (this._sondagem.padrao) {
				this.salvaPadrao(pad, function (res) {
					idPad = res;
					console.log("success pad");
				});
			}
			console.log(idPad);
			if (this._sondagem.termo) {
				this.salvaTermo(termo, function (res) {
					idTer = res;
					console.log("success term");
				});
			}
			console.log(idTer);
			var idSilo = this.getView().byId("Silo").getSelectedKey();
			/*eslint-disable*/
			var sondagem = {
				idSilo: parseInt(idSilo),
				idPadrao: parseInt(idPad),
				idTermometria: parseInt(idTer)
			};
			/*eslint-enabled*/
			jQuery.ajax({
				url: "/ServiceOData/FichaInteligente/Sondagem/insert.xsjs",
				async: true,
				TYPE: "POST",
				data: {
					dataobject: JSON.stringify(sondagem)
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
		}
	});
});