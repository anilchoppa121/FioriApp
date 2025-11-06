sap.ui.define(['testapp/freestyle/controller/Basecontroller'], (oController) => {
    "use strict"
    return oController.extend("testapp.freestyle.controller.Products", {
        onInit: function () {
            this._oVM = this.getView().byId('vm');
        },
        onBeforeRendering: function () {

        },
        onAfterRendering: function (oEvent) {
            // var table = this.byId('people').getBinding('items');;
            // var interval = setInterval( function(){
            //     let  context = table.getContexts()
            //     if(context.length > 0){
            //         debugger;
            //         clearInterval(interval);
            //     }
            // }, 1000)
        },
        onSettingsPress: function (oEvent) {

            var tableColumns = this.getTableColumns('product');
            this.onPersonalizationDialog(oEvent, tableColumns);
        },
        onClose: function (oEvent) {
            if (oEvent.getParameters() && oEvent.getParameters().reason == 'Ok') {
                this.handlePersonalizationOk(oEvent);
            }
        },
        onListItemPress: function (oEvent) {
            var item,oContext, prodId,oRouter;
            oRouter= this.getOwnerComponent().getRouter();
            item = oEvent.getSource();
            oContext= item.getBindingContext('ProductsModel');
            // prodId= oContext ? oContext.getObject().ProductID : "";
            prodId = oContext ? oContext.getPath().substring('/Products'.length): "";
            if(prodId){
                oRouter.navTo("detail",{
                    id: prodId
                });
            }



        },
        onHover:function(oEvent){
            debugger;
            console.log("Hovered over:");
        }
    });
});
