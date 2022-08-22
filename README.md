# Awning Remote Controller

- Software interface for an awning remote with buttons replaced by relay switches connected to GPIO pins on a Raspberry Pi to control opening and closing the awning
- Node.js server (index.js) handles HTTP POST requests to Raspberry Pi's local IP address at port 3000 through the following URLS: http://*ipaddress*:3000/up, http://*ipaddress*:3000/down, and http://*ipaddress*:3000/stop
- The handler functions runs the respective Python programs to simulate pressing the "up", "down", and "stop" buttons on the remote
- Potential future updates would be adding automatic closing of the awning when wind speeds are high (by perhaps using a weather API), and automatic stopping when the awning fabric has fully unrolled or fully rolled to avoid damage (by perhaps using an ultrasonic sensor to determine distance of front edge of the awning from the wall)
