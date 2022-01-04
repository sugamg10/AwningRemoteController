import RPi.GPIO as GPIO
from time import sleep

def onStop():
    """
    Stops the Awning
    """
    STOP_PIN = 5
    
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(STOP_PIN, GPIO.OUT, initial=GPIO.HIGH)
    
    GPIO.output(STOP_PIN, False)
    sleep(0.1)
    GPIO.output(STOP_PIN, True)

if __name__ == '__main__':
    onStop()
    GPIO.cleanup()
