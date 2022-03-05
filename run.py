#!/usr/bin/python3

# Runs LunchBot


import subprocess

from time import sleep


print('Starting LunchBot (press Ctrl+C to stop)...\n')
while True:
    with subprocess.Popen(['node', 'bot.js']) as p:
        try:
            p.wait()
        except KeyboardInterrupt:
            print('\nStopping LunchBot...')
            p.terminate()
            p.wait()
            break
        print('\nLunchBot quit unexpectedly; restarting LunchBot in 5 seconds...\n')
        sleep(5)

