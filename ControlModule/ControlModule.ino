// These define's must be placed at the beginning before #include "TimerInterrupt_Generic.h"
#define _TIMERINTERRUPT_LOGLEVEL_     4

#include "MBED_RPi_Pico_TimerInterrupt.h"
#include <Wifi_Setup_Library.h>
#include <Arduino_LSM6DSOX.h>
#include "Arduino.h"
#include "pinDefinitions.h"
#include <Servo.h>

#if defined(ARDUINO_NANO_RP2040_CONNECT) && defined(ARDUINO_ARCH_MBED)
  #define USING_MBED_RPI_PICO_TIMER_INTERRUPT        true
#else
  #error This code is intended to run on the MBED RASPBERRY_PI_PICO platform! Please check your Tools->Board setting.
#endif

#define PeriodIntervalMS      20000

// Init RPI_PICO_Timer
MBED_RPI_PICO_Timer ITimer0(0);

WiFiClient client;
Servo myservo;

bool periodEnded = false;
int val = 0;
int difference = 0;
float location = 0;
String buffer; 

int HTTP_PORT = 80;
String HTTP_METHOD = "GET";
char HOST_NAME[] = "liamfayle.pythonanywhere.com";
String PATH_NAME = "/arduino/getValues";

void PeriodicInterruptHandler(uint alarm_num)
{
  // Always call this for MBED RP2040 before processing ISR
  TIMER_ISR_START(alarm_num);
  periodEnded = true;

  // Always call this for MBED RP2040 after processing ISR
  TIMER_ISR_END(alarm_num);
}

void setup() 
{
  // initialize serial communication
  Serial.begin(9600); 
  while (!Serial);

  // initialize WiFi module:
  setupWifiModule();

  if (Debug)                         
    printWifiStatus();

  // initialize pins
  myservo.attach(9);

  // initialize interrupts
  if (ITimer0.attachInterruptInterval(PeriodIntervalMS * 1000, PeriodicInterruptHandler))
  {
    if (Debug)
      Serial.print(F("Starting ITimer0 OK, millis() = ")); Serial.println(millis());
  }
  else
  {
    if (Debug)
      Serial.println(F("Can't set ITimer0. Select another Timer, freq. or timer"));
  }
 
  if (Debug)
    Serial.println(MBED_RPI_PICO_TIMER_INTERRUPT_VERSION);

  // startup LSM6DSOX module
  if (!IMU.begin()) 
  {
    if (Debug)
      Serial.println("Failed to initialize IMU!");
    while (1);
  }

  // startup messages
  Serial.print("\nStarting Temperature Sensor Module on "); Serial.println(BOARD_NAME);
}

void loop() 
{
  if (periodEnded)
  {
    periodEnded = false;
    if (client.connect(HOST_NAME, HTTP_PORT)) 
    {
      Serial.println("Making GET request for temperature and setpoint");

      // make the HTTP request:
      client.println(HTTP_METHOD + " " + PATH_NAME +" HTTP/1.1");
      client.println("Host: " + String(HOST_NAME));
      client.println("Connection: close");
      client.println();

      buffer = "";

      while (client.connected()) 
      {
        if (client.available()) 
        {
          char c = client.read();
          buffer += String(c);
        }
      }

      // get the error from the response
      location = buffer.lastIndexOf("\n");
      difference = buffer.substring(location+1).toFloat();
      Serial.println("Error: " + String(difference) + " degrees Celsius");
    }

    val = map(val, 0, 1023, 0, 90);     
    myservo.write(val); 
  }
}