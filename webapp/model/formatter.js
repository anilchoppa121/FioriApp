sap.ui.define([], () => {
    "use strict";
    return {
        valueState: function (value) {
            if (value === 0) {
                return sap.ui.core.ValueState.Error;
            }
            else if (value < 10) {
                return sap.ui.core.ValueState.Warning;
            }
            else {
                return sap.ui.core.ValueState.Success;
            }
        },
        getIsDiscountinued: function(value){
            if(value){
                return 'Yes'
            }
            else if(value != undefined){
                return 'No'
            }
        }
    }
});