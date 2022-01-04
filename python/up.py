import RPi.GPIO as GPIO
from time import sleep

def onUp():
    """
    Opens the Awning
    """
    UP_PIN = 7
    
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(UP_PIN, GPIO.OUT, initial=GPIO.HIGH)
    
    GPIO.output(UP_PIN, False)
    sleep(0.1)
    GPIO.output(UP_PIN, True)

if __name__ == '__main__':
    onUp()
    GPIO.cleanup()
