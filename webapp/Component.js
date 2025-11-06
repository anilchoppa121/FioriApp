sap.ui.define([
    "sap/ui/core/UIComponent",
    "testapp/freestyle/model/models",
    "sap/m/MessageBox",
    "sap/m/Dialog"
], (UIComponent, models, MessageBox, Dialog) => {
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
            var timeoutmins, logoutTimer, warningTimer, warning_beforemins, dialog;
            timeoutmins = 3;
            warning_beforemins = 2
            function resetTimer() {
                clearTimeout(logoutTimer);
                clearTimeout(warningTimer);
                warningTimer = setTimeout(showWarningDialog, (timeoutmins - warning_beforemins) * 60 * 1000);
                logoutTimer = setTimeout(onLogout, timeoutmins * 60 * 1000);
            }
            // function onTimeOut() {
            //     console.log('LOGOUT')
            //     MessageBox.warning("your session is expired do to inactivity you will be logged out", {
            //         onClose: function () {
            //             window.location.reload();
            //         }
            //     })
            // }
            function showWarningDialog() {
                var vBox,  dialogText, countdownInterval, countdownSec;
                countdownSec = warning_beforemins * 60;
                dialogText = new sap.m.Text({
                    text: `your session will expires in ${formatTime(countdownSec)} due to inactivity`
                });
                vBox = new sap.m.VBox({
                    items: [dialogText,
                        new sap.m.Text({ text: "Do you want to stay logged in?" })
                    ]
                })
                dialog = new Dialog({
                    title: "session Timout Warning",
                    type: sap.m.DialogType.Message,
                    content: [vBox],
                    beginButton: new sap.m.Button({
                        text: "Stay loggedIn",
                        press: function () {
                            clearInterval(countdownInterval);
                            dialog.close();
                            resetTimer();
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: "Logg out",
                        press: function () {
                            clearInterval(countdownInterval);
                            dialog.close();
                            onLogout();
                        }
                    }),
                }).addStyleClass("sapUiSmallMargin");
                dialog.open();
                countdownInterval = setInterval(function () {
                    countdownSec--
                    if (countdownSec <= 0) {
                        clearInterval(countdownInterval);
                        dialog.close();
                        // onLogout();
                    }
                    else {
                        dialogText.setText(`your session will expires in ${formatTime(countdownSec)} due to inactivity`)
                    }
                }, 1000)
            }

            function onLogout() {
                if(dialog.isOpen()){
                    dialog.close();
                }
                sap.m.MessageBox.error("Your session has expired. Please log in again.", {
                    onClose: function () {
                        window.location.reload(); // or redirect to login page
                    }
                });
            }
            function formatTime(seconds) {
                var min, sec;
                min = Math.floor(seconds / 60);
                sec = seconds % 60;
                return `${min}:${sec.toString().padStart(2,"0")}`;
            }
            resetTimer();
            // window.onmousemove = resetTimer;
            // window.onkeypress = resetTimer;
            ["click", "mousemove", "keypress", "scroll", "touchstart"].forEach(function (evt) {
                document.addEventListener(evt, resetTimer);
            });
        },

    });
});