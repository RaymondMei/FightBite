from flask import Flask, jsonify, request
app = Flask(__name__)
import io
import torchvision.transforms as transforms
from PIL import Image
import torch
from torch import nn
from torchvision import models
classes = ["Bed Bug", "Flea", "Tick", "Mosquito"]
model = models.densenet121(pretrained=True)
state_dict = torch.load('/Users/evanwu/FightBite/backend/checkpoint.pth', map_location = torch.device("cpu"))
classifier = nn.Sequential(nn.Linear(1024, 512),
                           nn.ReLU(),
                           nn.Dropout(0.3),
                           nn.Linear(512,4),
                           nn.LogSoftmax(dim=1))
model.classifier = classifier

@app.route('/predict', methods=["POST"])
def predict():
    if request.method == "POST":
        image = request.files["image"]
        image_bytes = image.read()
        transform = transforms.Compose([transforms.Resize(255),
                                        transforms.CenterCrop(224),
                                        transforms.ToTensor(),
                                        transforms.Normalize(
                                            [0.485, 0.456, 0.406],
                                            [0.229, 0.224, 0.225])])
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert('RGB')
        image_input =  transform(image).unsqueeze(0)
        ps = torch.exp(model(image_input))
        top_p, top_class = ps.topk(1, dim=1)
        id = top_class.item()
        return jsonify({'id': id, 'class': classes[id]})

if __name__ == '__main__':
    app.run()