Clifer
======

A simple command line application to send a file from one computer to another.

Installation
------------

Coming soon

Usage
-----

### Send 1 file

On sending computer

    > clifer -f ./file
    Send Code: Ex1mp3C0d

On receiving computer

    > clifer -r Ex1mp3C0d ./file
    
### Send multiple files

On sending computer

    > tar -cf - ./file1 ./file2 | clifer
    Send Code: Ex1mp3C0d
    
On receiving computer

    > clifer -f Ex1mp3C0d | tar -xf -
    
### Compress file on the fly

On sending computer

    > gzip -c ./file | clifer
    Send Code: Ex1mp3C0d

On receiving computer

    > clifer -r Ex1mp3C0d | gunzip > ./file
    
    
Other Options
-------------

Clifer uses a very simple server to determine the details for the connection between
the two computers. There is a public server running at clifer.microapp.co. If you do
not want to use the public server, you can run your own server.

Then, you can pass -h host -p port to clifer with the details of your server.

License
-------

Copyright 2018 Kevin Gravier

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
