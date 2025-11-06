sap.ui.define(['sap/ui/core/Control', "sap/m/RatingIndicator", "sap/m/Label", "sap/m/Button"], (control, RatingIndicator, Label, oButton) => {
    "use strict"
    return control.extend("testapp.freestyle.control.ProductRating", {
        metadata: {
            properties: {
                value: {
                    type: "float",
                    defaultValue: 0
                }
            },
            aggregations: {
                _rating: {
                    type: "sap.m.RatingIndicator",
                    multiple: false,
                    visibility: "hidden"
                },
                _label: {
                    type: "sap.m.Label",
                    multiple: false,
                    visibility: "hidden"
                },
                _button: {
                    type: "sap.m.Button",
                    multiple: false,
                    visibility: "hidden"
                }
            },
            events: {
                change: {
                    parameters: {
                        value: {
                            type: "float"
                        }
                    }
                }
            }
        },
        init: function (ORM, control) {
            this.setAggregation("_rating", new RatingIndicator({
                iconSize: "2rem",
                liveChange: this._onRate.bind(this)
            })),
                this.setAggregation("_label", new Label({
                    text: "Product Rating"
                })),
                this.setAggregation('_button', new oButton({
                    text: "rating",
                    press: this._onSubmit.bind(this)
                }).addStyleClass("sapUiTinyMarginTopBottom"));
        },
        renderer: function (oRm, control) {
            oRm.openStart("div", control);
            oRm.class("myAppDemoWTProductRating");
            oRm.class("NoMarginBegin")
            oRm.openEnd();
            oRm.renderControl(control.getAggregation("_rating"));
            oRm.renderControl(control.getAggregation("_label"));
            oRm.renderControl(control.getAggregation("_button"));
            oRm.close("div");
        },
        setValue: function (fvalue) {
            this.setProperty("value", fvalue, true);
            this.getAggregation("_rating").setValue(fvalue);
        },
        _onRate: function (oEvent) {
            const resourceBundle = this.getModel('i18n').getResourceBundle();
            const fValue = oEvent.getParameter("value");
            this.setProperty("value", fValue, true);
            this.getAggregation('_label').setText(resourceBundle.getText("productRating", [fValue]));
            this.getAggregation("_label").setDesign("Bold");
        },
        _onSubmit: function (oEvent) {
            this.fireEvent("change", {
                value: this.getValue()
            });
        }
    })

})