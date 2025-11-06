sap.ui.define(['sap/m/Button', "sap/m/ButtonRenderer"],(oButton, oButtonRenderer) =>{
    "use strict"
    return oButton.extend("testapp.freestyle.control.Button",{

        metadata:{
            properties:{
                hovertext:{
                    type:"String",
                    defaultValue: ""
                }
            },
            aggregations:{},
            events:{
                hover:{}
            }
        },
        init: function(ORM,control){

        },
        renderer: oButtonRenderer,
        onmouseover:function(oEvent){
            this.fireHover();
        }
    })
})