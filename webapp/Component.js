sap.ui.define([
    "sap/ui/core/UIComponent",
    "testapp/freestyle/model/models",
    "sap/m/MessageBox"
], (UIComponent, models,MessageBox) => {
    "use strict";

    return UIComponent.extend("testapp.freestyle.Component", {
        metadata: {
            manifest: "json",
            // interfaces: [
            //     "sap.ui.core.IAsyncContentCreation"
            // ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
             if (!sap.ushell || !sap.ushell.Container) {
                this.handleAppTimeout();
            }
            // enable routing
            this.getRouter().initialize();
        },
        handleAppTimeout: function () {
            var timeoutmins, timer;
            timeoutmins = 1;
            function resetTimer() {
                clearTimeout(timer);
                timer = setTimeout(onTimeOut, timeoutmins * 60 *1000);
            }
            function onTimeOut() {
                console.log('LOGOUT')
                MessageBox.warning("your session is expired do to inactivity you will be logged out", {
                    onClose: function () {
                        window.location.reload();
                    }
                })
            }
            resetTimer();
            window.onmousemove = resetTimer;
            window.onkeypress = resetTimer;
        },

    });
});