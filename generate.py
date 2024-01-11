import os
import json
import csv
import random
import requests
import tqdm

def main():
    with open("./data/items.csv", "r") as file:
        items = read_items_ds(file)
    
    receipts = list([generate_receipt(items) for _  in range(20)])
    
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
    

def generate_receipt(items):
    item_length = int(max(1, random.normalvariate(12, 10)))
    items_base = random.choices(items, k=item_length)
    taxClasses = random.choice([["A", "B"], ["E", "F"]])

    items = []
    for (name, price) in items_base:
        price = random.normalvariate(price, price*0.5)
        taxClass = random.choice(taxClasses)
        items.append({
            "name": name,
            "price": round(price, 2),
            "taxClass": taxClass
        })
    return {
        "items": items
    }

def read_items_ds(f):
    reader = csv.reader(f)
    next(reader)
    return [(row[0], float(row[1])) for row in reader]

if __name__ == "__main__":
    main()