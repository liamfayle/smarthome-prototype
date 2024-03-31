#ifndef Wifi_Setup_Library
#define Wifi_Setup_Library

#include <Arduino.h>
#include <WiFiNINA.h>

#define Debug                 true

extern const char ssid[];
extern const char pass[];
extern int status;

void printWifiStatus();
void setupWifiModule();

#endif