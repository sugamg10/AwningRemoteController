import RPi.GPIO as GPIO
from time import sleep

def onDown():
    """
    Closes the Awning
    """
    DOWN_PIN = 3
    
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(DOWN_PIN, GPIO.OUT, initial=GPIO.HIGH)
    GPIO.output(DOWN_PIN, False)
    sleep(0.1)
    GPIO.output(DOWN_PIN, True)

if __name__ == "__main__":
    onDown()
    GPIO.cleanup()