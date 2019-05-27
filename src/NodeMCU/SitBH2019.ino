#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

int tryConnection = 50;
char ssid[] = "ssid-wifi";
char pass[] = "pass-wifi";

int sensorValue = 0;
int oldSensorValue = 0;

WiFiClient client;

void setup() 
{
    pinMode(A0, INPUT);
    pinMode(LED_BUILTIN, OUTPUT);
    
    Serial.begin(9600);
    delay(2000);
    
    WiFi.begin(ssid, pass);
    Serial.print("Conectando...");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
        tryConnection--;
        if (tryConnection == 0) 
        {
            Serial.println();
            Serial.println("Time-out");
            while(true);
        }
    }
    
    Serial.println();
    Serial.print("Conectado em ");
    Serial.println(ssid);
    Serial.print("Endereço IP do dispositivo = ");
    Serial.println(WiFi.localIP());
}

void loop() 
{
    readAnalogSensor();
    sendAnalogData();
}

void readAnalogSensor() 
{
    if( millis() % 50 != 0 )
        return;
       
    int potencia = analogRead(A0);
    potencia = 1023 - potencia;
    analogWrite(LED_BUILTIN, potencia);
    sensorValue = potencia;
}

void sendAnalogData()
{
    if( millis() % 2000 != 0 )
        return;

    if (oldSensorValue == sensorValue)
        return;
    
    oldSensorValue = sensorValue;

    HTTPClient http;      
    String host = "https://sitbh2019.cfapps.eu10.hana.ondemand.com/data";
      
    http.begin(host);
    
    http.addHeader("Content-Type", "application/json");
    String json = "{\n \"value\":" + String(sensorValue) + "\n}";
    
    int httpCode = http.POST(json);

    if (httpCode > 0) {
        Serial.printf("%s\n", http.getString().c_str());
    } else {
        Serial.printf("Erro HTTP POST: %s\n", http.errorToString(httpCode).c_str());
        Serial.println(String(httpCode));   
    }

    http.end();
}
