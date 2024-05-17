import sys
from Adafruit_IO import MQTTClient
AIO_KEY = ""
AIO_USERNAME = "Unray"
AIO_FEED_ID = ["button1", "button2"]

def connected(client):
    print("Connected to adafruit")
    for topic in AIO_FEED_ID:
        client.subscribe(topic)

def subscribe(client , userdata , mid , granted_qos):
    print("Subscribe successfully ...")

def disconnected(client):
    print("Disconnected ...")
    sys.exit (1)

def message(client , feed_id , payload):
    print("Send to adafruit " + payload)

print(1)
client = MQTTClient(AIO_USERNAME , AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe
client.connect()
client.loop_background()
while True:
    pass