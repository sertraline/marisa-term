# marisa-term
development  
[live demo](https://acid.im/)

This is javascript based fake terminal emulator with Flask backend.  

![preview](https://i.imgur.com/2d3LmrZ.jpg)

## Detailed functions usage  
* <kbd>ls</kbd> - list directories
* <kbd>cd</kbd> - change directory
* <kbd>groups</kbd> - prints groups
* <kbd>whoami</kbd> - prints who you are
* <kbd>hostname</kbd> - prints hostname  
* <kbd>cat</kbd> - looks for the reference to the String object (if there is any) in hierarchy array, then prints the said string.
  * `cat [file]`
* <kbd>echo</kbd> - displays a line of text.
  * `echo [string]`
  * base64:  
    `echo [string] | base64 [-d]`
  * rot13:  
    `echo [string] | rot13 [-d]`
* <kbd>hextorgb</kbd> - converts hex code to RGB value.
  * `hextorgb #00000`
* <kbd>host</kbd> - returns ip of specified domain. Simulates linux `host` command from `dnsutils`.
  * `host [domain]`
* <kbd>weather</kbd> - returns weather for specified city.
  ```
  weather Destruction Bay
  Weather:
      \  /        Destruction Bay:
   __ /‘‘.-.      TEMP: 12.0°C, broken clouds
      \_(   ).    HUM: 62%  WIND: 5.7 m/s
      /(___(__)   ◓ SUNRISE: 2019-07-27 12:34:28+00
                  ◒ SUNSET: 2019-07-28 06:08:42+00
  ```
* <kbd>encode</kbd> - encodes red channel's Least Significant Bits of specified image and returns link to the encoded image.
  * `encode [message]`
* <kbd>decode</kbd> - decodes red channel's LSB of specified image and returns hidden message.
* <kbd>imgconvert</kbd> - converts picture to specified format.
  * `imgconvert [png|jpg|jpeg|webp|gif]`
* <kbd>help</kbd> - prints help. 
  * `help [command]` gives more detailed help about the command provided.  

## Structure  
`raw.js` - contains 'raw' text data and several variables to use in `term.js`.  
`term.js` - emulator itself. All functions are defined within its body. For everything that can't be done with javascript it makes a POST request to backend server.  

`config.py` - contains configurations for your application.  
`api` - server core.  
  * Response logic is defined in TermController.  
  * Request logic is defined in TermService.  
  * Processing logic is defined in `modules` directory.  

`term.html` - emulator's body. It needs two divs to operate:  
```
      <div id="wrapper">
      <div id="screen">
```  
The rest of html elements is defined in `term.js`.  

```
marisa-term
├── css
│   ├── img [..]
│   ├── marisa.css
│   ├── marisa.gif
│   ├── raw.js
│   └── term.js
├── server
│   ├── api [..]
│   ├── config.py
│   ├── main.py
│   └── router.py
└── term.html
```  

## Requisites  
`python3 -m pip install --user fastapi pyowm Pillow uvicorn` 
* Set your Openweather API key in config.  

Run in the background:  
`exec nohup python3 main.py &`  
`disown`

## Creating apache2 reverse proxy for api requests  

Enable apache2 proxy modules:  
`sudo a2enmod proxy proxy_http proxy_balancer lbmethod_byrequests`  

Edit your main website config: add <Location /api> block to it.
```
<VirtualHost *:443>
...
    <Location "/api/">
        ProxyPass http://0.0.0.0:8050/
        ProxyPassReverse http://0.0.0.0:8050/
    </Location>
...
</VirtualHost>
```  

## Creating nginx reverse proxy  
```
    location /api/ {
        proxy_pass http://127.0.0.1:8050/;
        proxy_redirect off;
    }
```  

Now all requests to yourwebsite/api will be forwarded to your application.
