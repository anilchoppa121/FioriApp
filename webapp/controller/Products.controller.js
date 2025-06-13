sap.ui.define(['testapp/freestyle/controller/Basecontroller'], (controller) => {
    "use strict"
    return controller.extend("testapp.freestyle.controller.Products", {
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
        onSettingsPress:function(oEvent){

            var tableColumns = this.getTableColumns('product');
            this.onPersonalizationDialog(oEvent,tableColumns);
        },
        onClose: function(oEvent){
            if(oEvent.getParameters() && oEvent.getParameters().reason == 'Ok'){
                this.handlePersonalizationOk(oEvent);
            }  
        }      
    });
});
