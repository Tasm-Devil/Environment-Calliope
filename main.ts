input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    basic.showString("Temp: " + SCD30.readTemperature())
})
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    SCD30.setCalibration400ppm()
    basic.showIcon(IconNames.Heart)
    basic.pause(1000)
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    basic.showString("Hum: " + SCD30.readHumidity())
})
function displayCO2 (myco2wert: number) {
    wert = 50
    for (let y = 0; y <= 4; y++) {
        for (let x = 0; x <= 4; x++) {
            if (wert < myco2wert) {
                led.plot(x, 4 - y)
            } else {
                led.unplot(x, 4 - y)
            }
            wert += 100
        }
    }
    if (myco2wert < 800) {
        basic.setLedColor(0x00ff00)
    } else if (myco2wert < 1000) {
        basic.setLedColor(0xffff00)
    } else if (myco2wert < 1400) {
        basic.setLedColor(0xff8000)
    } else if (myco2wert < 1800) {
        basic.setLedColor(0xff0000)
    } else {
        basic.setLedColor(0x7f00ff)
    }
}
let co2wert = 0
let wert = 0
serial.redirectToUSB()
serial.setBaudRate(BaudRate.BaudRate9600)
basic.showString("CO2-AMPEL")
serial.writeLine("")
serial.writeLine("")
serial.writeLine("Starting CO2-Ampel")
serial.writeLine("SCD30 Version: " + SCD30.getVersion())
serial.writeLine("Kalibrierung: " + SCD30.getCalibration())
serial.writeLine("Press A+B together to set calibration to 400ppm")
serial.writeLine("ready...")
for (let demo = 0; demo <= 2500; demo++) {
    displayCO2(demo)
    basic.pause(2)
}
basic.forever(function () {
    basic.pause(2000)
    co2wert = SCD30.readCO2()
    serial.writeLine("")
    serial.writeString("")
    serial.writeNumber(co2wert)
    serial.writeString(";")
    serial.writeNumber(SCD30.readTemperature())
    serial.writeString(";")
    serial.writeNumber(SCD30.readHumidity())
    displayCO2(co2wert)
})
