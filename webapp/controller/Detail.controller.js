sap.ui.define(['testapp/freestyle/controller/Basecontroller'], function (oController) {
    "use strict"

    return oController.extend("testapp/freestyle/controller/Detail", {
        onInit: function () {
            var oRouter;
            oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute('detail').attachPatternMatched(this._attachMatched, this);
        },
        _attachMatched: function (oEvent) {
            var ProductId, view;
            ProductId = oEvent.getParameter('arguments').id;
            view = this.getView();
            view.bindElement({
                path: "/Products" + ProductId,
                model: "ProductsModel",
                parameters: {
                    expand: "Category,Supplier,Order_Details"
                },
                events: {
                    dataRequested: function () {
                        view.setBusy(true);
                    },
                    dataReceived: function (oEvent) {
                        view.setBusy(false);
                    }
                }
            });
        }
    });
});