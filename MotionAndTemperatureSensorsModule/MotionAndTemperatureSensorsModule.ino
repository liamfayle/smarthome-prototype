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
#define MotionDetectionTime   20000
#define WifiEnabled           false

// Init RPI_PICO_Timer
MBED_RPI_PICO_Timer ITimer0(0);

WiFiClient client;

// Declare global variables
const int motionInterruptPin = 10;  // Input D10 (= GPIO5)
bool periodEnded = false;
int roomTemperature = 0;
int roomOccupied = 0;
unsigned long lastMotionDetectedTime = 0;
String data = "{\"temperature\": \"" + String(0) + "\", \"motion\": \"" + String(0) + "\"}";

// Declare global variables for http requests
int HTTP_PORT = 80;
String HTTP_METHOD = "POST";
char HOST_NAME[] = "liamfayle.pythonanywhere.com";
String PATH_NAME = "/arduino/sendValues";

void PeriodicInterruptHandler(uint alarm_num)
{
  // Always call this for MBED RP2040 before processing ISR
  TIMER_ISR_START(alarm_num);
  periodEnded = true;

  // Always call this for MBED RP2040 after processing ISR
  TIMER_ISR_END(alarm_num);
}

void motionISR() {
  noInterrupts();
  roomOccupied = 1;
  lastMotionDetectedTime = millis();
  interrupts();
}

void setup() 
{
  // initialize serial communication
  Serial.begin(9600); 
  while (!Serial);



  // initialize WiFi module:
  if (WifiEnabled)
  {
    setupWifiModule();

    if (Debug)                         
      printWifiStatus();
  }
  


  // initialize interrupts
  attachInterrupt(digitalPinToInterrupt(motionInterruptPin), motionISR, RISING);

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

  if (millis() - lastMotionDetectedTime > MotionDetectionTime || lastMotionDetectedTime == 0)
  {
    roomOccupied = 0;
  }

  if (periodEnded)
  {

    if (IMU.temperatureAvailable())
    {
      IMU.readTemperature(roomTemperature);
    }
      
    periodEnded = false;

    if (Debug)
    {
      Serial.println("Period Ended");
      Serial.println("Temperature: " + String(roomTemperature));
      Serial.println("Motion detected in last " + String(MotionDetectionTime) + " ms: " + String(roomOccupied));
      Serial.println();
    }


    if (WifiEnabled)
    {
      if (client.connect(HOST_NAME, HTTP_PORT)) 
      {  
        data = "{\"temperature\": \"" + String(roomTemperature) + "\", \"motion\": \"" + String(roomOccupied) + "\"}";
        
        if (Debug)
        {  
          Serial.println("Making POST request with temperature and motion sensor data");
          Serial.println("Data: " + data);
          Serial.println();
        }


        // make the HTTP request:
        client.println(HTTP_METHOD + " " + PATH_NAME +" HTTP/1.1");
        client.println("Host: " + String(HOST_NAME));
        client.println("Connection: close");
        client.print("Content-Length: ");\
        client.println(data.length());
        client.println();
        client.println(data);
      }
    }
  }
}