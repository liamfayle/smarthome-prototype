// These define's must be placed at the beginning before #include "TimerInterrupt_Generic.h"
#define _TIMERINTERRUPT_LOGLEVEL_     4

#include "MBED_RPi_Pico_TimerInterrupt.h"
#include <Wifi_Setup_Library.h>
#include <Arduino_LSM6DSOX.h>
#include "Arduino.h"
#include "pinDefinitions.h"

#if defined(ARDUINO_NANO_RP2040_CONNECT) && defined(ARDUINO_ARCH_MBED)
  #define USING_MBED_RPI_PICO_TIMER_INTERRUPT        true
#else
  #error This code is intended to run on the MBED RASPBERRY_PI_PICO platform! Please check your Tools->Board setting.
#endif

#define PeriodIntervalMS      10000

// Init RPI_PICO_Timer
MBED_RPI_PICO_Timer ITimer0(0);
WiFiServer server(80);

bool periodEnded = false;
int roomTemperature = 0;

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

  // start the web server on port 80
  server.begin(); 

  if (Debug)                         
    printWifiStatus();

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
  WiFiClient client = server.available();

  if (periodEnded)
  {

    if (IMU.temperatureAvailable())
    {
      IMU.readTemperature(roomTemperature);
      Serial.print("LSM6DSOX Temperature = ");Serial.print(roomTemperature);Serial.println(" °C");
    }
      
    periodEnded = false;
    Serial.print("Period Ended: ");Serial.println(roomTemperature);
  }
}