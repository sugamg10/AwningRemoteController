import RPi.GPIO as GPIO
from time import sleep, time
from math import sqrt
import sys

def measureDist(tempF):
    """
    Measures distance of object and returns it in centimeters
    """
    TRIG = 38
    ECHO = 40
    
    GPIO.setmode(GPIO.BOARD)
    
    GPIO.setup(TRIG, GPIO.OUT)
    GPIO.setup(ECHO, GPIO.IN)
    
    tempK = (tempF - 32) * (5/9) + 273.15
    SPEED_OF_SOUND = 331*sqrt(tempK/273)
    
    GPIO.output(TRIG, False)
    sleep(1)
    
    GPIO.output(TRIG, True)
    sleep(0.00001)
    GPIO.output(TRIG, False)
    
    while GPIO.input(ECHO) == 0:
        pass
    begin = time()
    while GPIO.input(ECHO) == 1:
        pass
    end = time()
    
    duration = end-begin
    distance = duration*SPEED_OF_SOUND/2
    centimeters = round(distance*100, 3)
    return centimeters

if __name__ == '__main__':
    try:
        tempF = int(sys.argv[1])
        print(measureDist(tempF))
        GPIO.cleanup()
    except:
        pass
