sap.ui.define(['testapp/freestyle/controller/Basecontroller', "sap/m/HBox", "sap/m/VBox", "sap/suite/ui/commons/MicroProcessFlow", "sap/suite/ui/commons/MicroProcessFlowItem"
], function (oController, HBox, VBox, MicroProcessFlow, MicroProcessFlowItem) {
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
        },
        onOrderIdPress: function (oEvent) {
            var oControl, orderId, productId, bindingObject, detailsModel;
            var detailsModel = this.getView().getModel('DetailsModel');
            oControl = oEvent.getSource();
            bindingObject = oControl.getBindingContext('ProductsModel').getObject();
            orderId = bindingObject.OrderID;
            productId = bindingObject.ProductID;
            this.getView().setBusy(true);

            detailsModel.read("/Order_Details(OrderID=" + orderId + ",ProductID=" + productId + ")/Order", {
                success: function (oData) {
                    this.getView().setBusy(false);
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern: "dd MMM yyyy, HH:mm"
                    });
                    oData.OrderDate = oDateFormat.format(oData.OrderDate);
                    oData.ShippedDate = oDateFormat.format(oData.ShippedDate);
                    oData.RequiredDate = oDateFormat.format(oData.RequiredDate);
                    this._openPopOver(oEvent, oData);
                }.bind(this),
                error: function (oError) {
                    console.log("error" + oError)
                }
            });
        },
        _openPopOver: function (oEvent, data) {
            var oControl, view;
            oControl = oEvent.getSource();
            view = this.getView();
            if (!this.popover) {
                this.popover = this.loadFragment({
                    name: "testapp/freestyle/fragment/Popover"
                }).then(function (popover) {
                    view.addDependent(popover);
                    return popover;
                }.bind(this));
            }
            this.popover.then(function (popover) {
                var vBox, mChart;
                popover.removeAllContent();
                mChart = new MicroProcessFlow({
                    content: [
                        new MicroProcessFlowItem({
                            title: "Ordered Date: " + data.OrderDate,
                            icon: "sap-icon://order-status",
                            state: "Information"
                        }),
                        new MicroProcessFlowItem({
                            title: "Shipped date: " + data.ShippedDate,
                            icon: "sap-icon://shipping-status",
                            state: "Success"
                        }),
                        new MicroProcessFlowItem({
                            title: "RequiredDate: " + data.RequiredDate,
                            icon: "sap-icon://complete",
                            state: "Success"
                        })
                    ]
                })
                vBox = new VBox({
                    items: [
                        new HBox({
                            items: [
                                new sap.ui.core.Icon({
                                    src: "sap-icon://customer",
                                    size: "2rem"
                                }),
                                new VBox({
                                    items: [
                                        new sap.m.Text({
                                            text: data.CustomerID
                                        }).addStyleClass("boldText"),
                                        new HBox({
                                            items: [
                                                new sap.m.Label({
                                                    text: "Address",
                                                    showColon: true,
                                                    vAlign: "Bottom"
                                                }),
                                                new sap.m.Text({
                                                    text: data.ShipName + "" + data.ShipAddress
                                                })
                                            ]
                                        })
                                    ]
                                }).addStyleClass('sapUiSmallMarginBegin')
                            ]
                        }),
                        mChart
                    ]
                })
                popover.addContent(vBox);
                popover.openBy(oControl);
            });
        }
    });
});