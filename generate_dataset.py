import os
import json
import requests
import tqdm

from generate_receipt import generate_receipts

def main():
    receipts = generate_receipts(2000)
    
    os.makedirs("./kassenzettel/images", exist_ok=True)
    os.makedirs("./kassenzettel/masks", exist_ok=True)
    os.makedirs("./kassenzettel/data", exist_ok=True)
    for i, receipt in enumerate(tqdm.tqdm(receipts)):
        image = download_receipt(receipt)
        with open(f"./kassenzettel/images/{i+1}.png", "wb") as file:
            file.write(image)
        masks = download_receipt(receipt, masks=True)
        with open(f"./kassenzettel/masks/{i+1}.png", "wb") as file:
            file.write(masks)
        with open(f"./kassenzettel/data/{i+1}.json", "w") as file:
            json.dump(receipt, file)

def download_receipt(receipt, masks=False):
    url = "http://localhost:3000/api/generate"
    data = {"receipt": receipt, "masks": masks}
    r = requests.post(url, json=data)
    r.raise_for_status()
    return r.content
    

if __name__ == "__main__":
    main()