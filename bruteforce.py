import requests
import string
import random
import threading

serverIp = "https://...";
authCode = "...";

count = 0
working = 0
invalid = 0
error = 0

bruteforcedUrls = []
invalidUrls = []
erroredUrls = []

def id_generator(size=7, chars=string.ascii_letters + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def requestWorker():
    while True:
        sendRequest("png")
        sendRequest("jpg")
        sendRequest("jpeg")
        sendRequest("gif")

def sendRequest(imgType):
    global count, working, invalid, error, bruteforcedUrls, invalidUrls, erroredUrls
    imgId = id_generator()
    if len(invalidUrls) > 20000:
        for i in range(2000):
            invalidUrls.pop(i)
    if "https://i.imgur.com/" + imgId + "." + imgType in bruteforcedUrls:
        return sendRequest(imgType)
    url = "https://i.imgur.com/" + imgId + "." + imgType
    response = requests.request("GET", url, allow_redirects=False)

    count = count + 1

    if (response.status_code == 200):
        working = working + 1
        bruteforcedUrls.append(url)

        requests.request("POST", serverIp + ":3009/upload/" + imgId + "." + imgType + "?auth=" + authCode)

        print("[" + str(count) + "] " + "[" + str(working) + "] Working: " + url)
    elif (response.status_code == 404 or response.status_code == 302 or "removed.png" in response.text):
        invalid = invalid + 1
        invalidUrls.append(url)

        print("[" + str(count) + "] " + "[" + str(invalid) + "] [" + str(working) + "] Invalid: " + url)
    else:
        error = error + 1
        erroredUrls.append(url)

        print("[" + str(count) + "] " + "[" + str(error) + "] Errored: " + url)

def init():
    global bruteforcedUrls
    print("INIT | IMGUR BRUTEFORCER")
    bruteforcedUrls = requests.request("GET", serverIp + ":3009/list").text.split('\r\n')
    threads = list()
    for i in range(30):
        x = threading.Thread(target=requestWorker)
        threads.append(x)
        x.start()

init()