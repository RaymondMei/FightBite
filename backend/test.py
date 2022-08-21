import requests

resp = requests.post("http://127.0.0.1:5000/predict",
                     files={"image": open('backend/Screen Shot 2022-08-20 at 8.14.08 PM.png', 'rb')})
print(resp.json())