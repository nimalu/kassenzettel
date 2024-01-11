import csv
import random
import requests

def main():
    with open("./data/items.csv", "r") as file:
        items = read_items_ds(file)
    
    data = { "receipt": generate_receipt(items), "masks": True }
    url = "http://localhost:3000/api/generate"
    with requests.post(url, json=data, stream=True) as r:
        download_file(r, "./kassenzettel.png")

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

def download_file(r, file):
    r.raise_for_status()
    with open(file, "wb") as f:
        for chunk in r.iter_content(chunk_size=8192):
            f.write(chunk)


if __name__ == "__main__":
    main()