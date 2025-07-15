sap.ui.define([
    "testapp/freestyle/controller/Basecontroller"
], (Controller) => {
    "use strict";

    return Controller.extend("testapp.freestyle.controller.App", {
        onInit() {
            // Controller.prototype.onInit.call(this);
             // init method of base controller is not called directly. it is called if the controller is attached to the view
            //  sap.ui.getCore().applyTheme('sap_horizon'); 
        }
    });
});