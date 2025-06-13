sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/VariantItem",
    "sap/m/SharingMode",
    "sap/m/MessageToast",
    "testapp/freestyle/libs/underscore-min"
], (Controller, VariantItem, SharingMode, MessageToast) => {
    "use strict";

    return Controller.extend("testapp.freestyle.controller.Basecontroller", {
        // onInit: function () {

        // },
        onSave: function (oEvent) {
            var params = oEvent.getParameters();
            if (params.overwrite) {
                //Not yet implemented 
            }
            else {
                this._createNewItem(params);
            }
            this._oVM.setModified(false);
        },
        _createNewItem: function (params) {
            var skey = "_key" + Date.now();
            var Variantmanagementref = this.getView().byId('vm');
            var item = new VariantItem({
                key: skey,
                author: "Anil",
                executeOnSelect: params.execute,
                title: params.name,
                remove: true,
                favorite: true,
                changeable: true,
            });
            if (params.hasOwnProperty('public') && params.public) {
                item.setSharing(SharingMode.Public);
            }
            if (params.def) {
                Variantmanagementref.setDefaultKey(skey);
            }
            Variantmanagementref.addItem(item);
            this._showMessagesMessage("New View created with title" + item.getTitle());

        },
        _showMessagesMessage: function (smessage) {
            MessageToast.show(smessage, {
                closeOnBrowserNavigation: "true"
            });
        },
        onManage: function (oEvent) {
            var params = oEvent.getParameters();
            this._updatevariantItems(params);
        },

        _updatevariantItems: function (params) {
            if (params && params.deleted) {
                params.deleted.forEach(skey => {
                    var oItem = this._oVM.getItemByKey(skey);
                    if (oItem) {
                        this._oVM.removeItem(oItem);
                        oItem.destroy();
                    }
                });
            }
            if (params.hasOwnProperty('def')) {
                this._oVM.setDefaultKey(params.def);
            }
            this._checkCurrentVariant();
        },
        _checkCurrentVariant: function () {
            var selectedKey, oItem, sKey;
            selectedKey = this._oVM.getSelectedKey();
            oItem = this._oVM.getItemByKey(selectedKey);
            if (!oItem) {
                sKey = this._oVM.getStandardVariantKey();
                if (sKey) {
                    this._oVM.setSelectedKey(sKey);
                }
            }


        },
        onPersonalizationDialog: function (oEvent, tableColumns) {
            if (!this._pDialogProm) {
                this._pDialogInitialized = false;
                this._pDialogProm = this.loadFragment({
                    name: "testapp/freestyle/fragment/Personalization"
                });
            }
            this._pDialogProm.then(function (oDialog) {
                if (!this._pDialogInitialized) {
                    this.getView().addDependent(oDialog);
                    this._pDialog = oDialog;
                    this._pDialogInitialized = true;
                }
                this._setInitialdata(tableColumns);
                this._pDialog.open();
            }.bind(this));
        },
        onReset: function (oEvent) {
            this._setInitialdata(this.getTableColumns('product'));
        },
        onClose: function (oEvent) {
          //Not implemented yet
        },
        _setInitialdata: function (tableColumns) {
            if (tableColumns.length > 0) {
                var initialdata = []
                tableColumns.forEach(function (column) {
                    var text = column.getHeader().getText();
                    initialdata.push({
                        name: text,
                        label: text,
                        visible: column.getVisible()
                    })
                });
                this.getView().byId('columnPanel').setP13nData(initialdata);
            }
        },
        handlePersonalizationOk: function (oEvent) {
            var tableColumns = this.getTableColumns('product');
            if (oEvent && oEvent.getSource()) {
                var panels, columnItems;
                panels = oEvent.getSource().getPanels();
                if (panels.length > 0) {
                    panels.forEach(function (panel, index) {
                        if (panel instanceof sap.m.p13n.SelectionPanel) {
                            columnItems = panel.getP13nData();
                        }
                        else if (panel instanceof sap.m.p13n.SortPanel) {
                            sortItems = panel.getP13nData();
                        }
                        else if (panel instanceof sap.m.p13n.GroupPanel) {
                            groupItems = panel.getP13nData();
                        }
                    }.bind(this));
                }
                if (columnItems) {
                    tableColumns.forEach(function (column) {
                        var text, item;
                        text = column.getHeader().getText();
                        item = _.findWhere(columnItems, { label: text })
                        if (item) {
                            column.setVisible(item.visible);
                        }
                    });
                }
            }
        },
        getTableColumns: function (sId) {
            var columns = this.getView().byId(sId) ? this.getView().byId(sId).getColumns() : [];
            return columns;
        }
    });
});